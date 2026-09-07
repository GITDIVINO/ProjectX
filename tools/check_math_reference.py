#!/usr/bin/env python3
"""Independent Fraction oracle. No imports from the JS calculation engine.
Usage: node platform/audit-fixtures.cjs /tmp/projectx-fixtures.json
       python3 tools/check_math_reference.py /tmp/projectx-fixtures.json
"""
import json
import sys
from fractions import Fraction as F
from decimal import Decimal


def f(x):
    return F(str(x))


def cents(x):
    x *= 100
    return (2*x.numerator+x.denominator)//(2*x.denominator)


def reference(s):
    lots = [l for l in s['lots'] if l['selected']]
    ports = [p for p in s['ports'] if any(p['name'] in (l['loadPort'], l['port']) for l in lots)]
    names = [p['name'] for p in ports]
    price = {k:f(v) for k,v in s['prices'].items()}
    hire = f(s['hire']); days = F(0); rows = []; usage = dict.fromkeys(price, F(0))

    def fuel(grade, mass):
        usage[grade] += mass
        return mass * price[grade]

    def add(value, eligible):
        rows.append((cents(value), [l['id'] for l in eligible]))

    legs = [next(l for l in s['legs'] if l['from']==a and l['to']==b) for a,b in zip(names,names[1:])]
    if s['ballastEnabled']:
        legs.insert(0, s['ballast'])
    for leg in legs:
        d = f(leg['distance'])/(f(leg['speed'])*24)*(1+f(leg['margin'])/100)
        e = d * f(leg['eca'])/f(leg['distance'])
        eligible = lots if leg is s['ballast'] else [l for l in lots if names.index(l['loadPort'])<=names.index(leg['from'])<names.index(l['port'])]
        amount = fuel('main',(d-e)*f(leg['burn'])) + fuel('eca',e*f(leg['ecaBurn'])) + fuel('aux',d*f(leg['aux']))
        add(amount,eligible);add(d*hire,eligible);days+=d
    for p in ports:
        eligible = [l for l in lots if p['name'] in (l['loadPort'],l['port'])]
        quantity = sum((f(l['quantity']) for l in eligible),F(0))
        work = quantity/f(p['rate'])
        calendar = f(p['calendar']) if p['terms']=='manual' else work
        idle = calendar-work+(f(p['turn'])+f(p['extra']))/24
        amount = fuel(p['fuel'],work*f(p['working'])+idle*f(p['idle'])) + fuel('aux',work*f(p['auxWorking'])+idle*f(p['auxIdle']))
        if p.get('boiler') and p.get('boilerDays'):
            amount += fuel(p['boilerFuel'],f(p['boilerDays'])*f(p['boiler']))
        add(f(p['da']),eligible);add(amount,eligible);add((work+idle)*hire,eligible);days+=work+idle
    for c in s['costs']:
        add(f(c['amount']),lots);add(fuel(c['fuel'],f(c['days'])*f(c['burn'])),lots);add(f(c['days'])*hire,lots);days+=f(c['days'])
    allocations = dict.fromkeys([l['id'] for l in lots],0)
    row_shares = []
    for amount,eligible in rows:
        weights = [f(l['quantity']) if s['allocation']=='tonnage' or l['id'] in eligible else F(0) for l in lots]
        exact = [amount*w/sum(weights) for w in weights]
        portions = [x.numerator//x.denominator for x in exact]
        order = sorted(range(len(lots)),key=lambda i:(-(exact[i]-portions[i]),i))
        for i in order[:amount-sum(portions)]:
            portions[i]+=1
        shares = dict(zip(allocations,portions));row_shares.append(shares)
        for key,value in shares.items():
            allocations[key]+=value
    return rows,days,usage,row_shares,allocations


cases=json.load(open(sys.argv[1]),parse_float=Decimal)
for i,case in enumerate(cases):
    s=case['input'];b=case['result']['budget']
    assert b is not None,(i,case['result']['errors'])
    rows,days,usage,row_shares,allocation=reference(s)
    assert [r[0] for r in rows]==[r['cents'] for r in b['rows']],('rows',i)
    assert sum(r[0] for r in rows)==b['totalCents'],('total',i)
    assert abs(float(days)-float(b['days']))<1e-9,('days',i)
    for grade,mass in usage.items():
        assert abs(float(mass)-float(b['usage'][grade]))<1e-8,('fuel',grade,i)
    assert row_shares==[r['shares'] for r in b['rows']],('individual shares',i)
    assert allocation=={a['id']:a['cents'] for a in b['allocation']},('allocation',i)
    quantity=sum((f(l['quantity']) for l in s['lots'] if l['selected']),F(0))
    extra=cents(f(s['extraIncome']))
    if s['freight'] is not None:
        gross=cents(quantity*f(s['freight']));commission=cents(F(gross,100)*f(s['commission'])/100);net=gross-commission+extra
        for key,value in [('gross',gross),('commission',commission),('net',net),('pnl',net-b['totalCents'])]:
            assert f(b[key])*100==value,(key,i,b[key],value)
        voyage=sum(r['cents'] for r in b['rows'] if r['kind']!='hire')
        assert abs(float(F(net-voyage,100)/days)-float(b['tce']))<1e-8,('tce',i)
    else:
        assert all(b[key] is None for key in ('gross','commission','net','pnl','tce'))
    quote=f(b['requiredFreightQuote']);assert (quote*100).denominator==1
    quoted_gross=cents(quantity*quote)
    quoted_commission=cents(F(quoted_gross,100)*f(s['commission'])/100)
    assert quoted_gross-quoted_commission+extra>=b['totalCents'],('covering quote',i)
    # Independently verify current loading-plan mass and SF volumes, including unassigned cargo.
    lots={l['id']:l for l in s['lots'] if l['selected']}
    for h in case['result']['ship']['holds']:
        cells=[a for a in s['allocations'] if a['hold']==h['id'] and a['lot'] in lots]
        mass=sum((f(a['quantity']) for a in cells),F(0))
        volume=sum((f(a['quantity'])*f(lots[a['lot']]['sf']) for a in cells),F(0))
        assert abs(float(mass)-float(h['quantity']))<1e-8,('hold mass',i)
        assert abs(float(volume)-float(h['used']))<1e-8,('hold volume',i)
        assert abs(float(100*volume/f(h['volume']))-float(h['fill']))<1e-8,('hold fill',i)
print(f'PASS: {len(cases)} independent Fraction cases: costs, time, fuel, freight, commission, TCE, P&L, every sale share, covering quote and hold mass/volume/fill. Includes ballast, manual calendars, boiler fuels, 3 load / 6 discharge ports and both allocation methods.')
