(function(root){
'use strict';
const gcd=(a,b)=>{a=a<0n?-a:a;while(b){const t=a%b;a=b;b=t;}return a||1n;};
class Rational{
 constructor(n,d=1n){if(d===0n)throw RangeError('Division by zero');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);this.n=n/g;this.d=d/g;}
 static from(value){if(value instanceof Rational)return value;if(typeof value==='bigint')return new Rational(value);if(typeof value!=='number'||!Number.isFinite(value))throw RangeError('Invalid number');
  // A safe integer is already exact: skip the decimal-string parse that the general case needs.
  if(Number.isInteger(value)&&Math.abs(value)<=Number.MAX_SAFE_INTEGER)return new Rational(BigInt(value));
  const [mantissa,exp='0']=String(value).toLowerCase().split('e');const negative=mantissa.startsWith('-');const parts=mantissa.replace('-','').split('.');const power=Number(exp)-(parts[1]?.length||0);let n=BigInt(parts.join(''));if(negative)n=-n;return power>=0?new Rational(n*10n**BigInt(power)):new Rational(n,10n**BigInt(-power));}
 add(x){x=Rational.from(x);return new Rational(this.n*x.d+x.n*this.d,this.d*x.d);}
 sub(x){x=Rational.from(x);return new Rational(this.n*x.d-x.n*this.d,this.d*x.d);}
 mul(x){x=Rational.from(x);return new Rational(this.n*x.n,this.d*x.d);}
 div(x){x=Rational.from(x);return new Rational(this.n*x.d,this.d*x.n);}
 number(){return Number(this.n)/Number(this.d);}
 roundCents(){const sign=this.n<0n?-1n:1n,n=(this.n<0n?-this.n:this.n)*100n;const out=sign*((n*2n+this.d)/(2n*this.d));const value=Number(out);if(!Number.isSafeInteger(value))throw RangeError('Amount is outside the exact monetary range');return value;}
}
const api={Rational};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProjectXArithmetic=api;
})(globalThis);
