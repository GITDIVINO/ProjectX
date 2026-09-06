#!/usr/bin/env python3
"""Independent Fraction oracle for the exported deterministic fixture set.
Run node platform/audit-fixtures.cjs /tmp/projectx-fixtures.json first.
No imports from the JavaScript implementation; every cent row is reconstructed.
"""
import json,sys
from fractions import Fraction as F
from decimal import Decimal

def f(x): return F(str(x))
def cents(x):
    x=x*100
    return (2*x.numerator+x.denominator)//(2*x.denominator)

def reference(s):
    lots=[l for l in s['lots'] if l['selected']]
    ports=[p for p in s['ports'] if any(l['loadPort']==p['name'] or l['port']==p['name'] for l in lots)]
    price={k:f(v) for k,v in s['prices'].items()}
    hire=f(s['hire']); days=F(0); rows=[]
    for a,b in zip(ports,ports[1:]):
        l=next(l for l in s['legs'] if l['from']==a['name'] and l['to']==b['name'])
        d=f(l['distance'])/(f(l['speed'])*24)*(1+f(l['margin'])/100)
        e=f(l['eca'])/(f(l['speed'])*24)*(1+f(l['margin'])/100)
        fuel=(d-e)*f(l['burn'])*price['main']+e*f(l['ecaBurn'])*price['eca']+d*f(l['aux'])*price['aux']
        rows.extend([cents(fuel),cents(d*hire)]);days+=d
    for p in ports:
        q=sum((f(l['quantity']) for l in lots if p['name'] in [l['loadPort'],l['port']]),F(0))
        work=q/f(p['rate']);idle=(f(p['turn'])+f(p['extra']))/24
        fuel=(work*f(p['working'])+idle*f(p['idle']))*price[p['fuel']]+(work*f(p['auxWorking'])+idle*f(p['auxIdle']))*price['aux']
        rows.extend([cents(f(p['da'])),cents(fuel),cents((work+idle)*hire)]);days+=work+idle
    for c in s['costs']:
        rows.extend([cents(f(c['amount'])),cents(f(c['days'])*f(c['burn'])*price[c['fuel']]),cents(f(c['days'])*hire)]);days+=f(c['days'])
    gross=cents(sum((f(l['quantity']) for l in lots),F(0))*f(s['freight']))
    commission=cents(F(gross,100)*f(s['commission'])/100)
    net=gross-commission+cents(f(s['extraIncome']))
    return rows,days,gross,commission,net

cases=json.load(open(sys.argv[1]),parse_float=Decimal)
for i,case in enumerate(cases):
    rows,days,gross,commission,net=reference(case['input']);b=case['result']['budget']
    assert b is not None,(i,case['result']['errors'])
    assert rows==[r['cents'] for r in b['rows']],('rows',i)
    assert sum(rows)==b['totalCents'],('total',i)
    assert abs(float(days)-float(b['days']))<1e-9,('days',i)
    for key,value in [('gross',gross),('commission',commission),('net',net),('pnl',net-sum(rows))]:
        assert f(b[key])*100==value,(key,i,b[key],value)
    assert sum(a['cents'] for a in b['allocation'])==sum(rows),('allocation',i)
print(f'PASS: {len(cases)} independent Fraction cases; every cost row, total, days, gross, commission, net, P&L and allocation reconciliation.')
