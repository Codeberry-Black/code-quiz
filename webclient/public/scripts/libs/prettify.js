!function(){var h=null;window.PR_SHOULD_USE_CONTINUATION=!0;(function(){function U(b){function d(e){var c=e.charCodeAt(0);if(92!==c)return c;var a=e.charAt(1);return(c=u[a])?c:"0"<=a&&"7">=a?parseInt(e.substring(1),8):"u"===a||"x"===a?parseInt(e.substring(2),16):e.charCodeAt(1)}function g(e){if(32>e)return(16>e?"\\x0":"\\x")+e.toString(16);e=String.fromCharCode(e);return"\\"===e||"-"===e||"]"===e||"^"===e?"\\"+e:e}function c(e){var c=e.substring(1,e.length-1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g);
    e=[];var a="^"===c[0],b=["["];a&&b.push("^");for(var a=a?1:0,f=c.length;a<f;++a){var k=c[a];if(/\\[bdsw]/i.test(k))b.push(k);else{var k=d(k),m;a+2<f&&"-"===c[a+1]?(m=d(c[a+2]),a+=2):m=k;e.push([k,m]);65>m||122<k||(65>m||90<k||e.push([Math.max(65,k)|32,Math.min(m,90)|32]),97>m||122<k||e.push([Math.max(97,k)&-33,Math.min(m,122)&-33]))}}e.sort(function(e,a){return e[0]-a[0]||a[1]-e[1]});c=[];f=[];for(a=0;a<e.length;++a)k=e[a],k[0]<=f[1]+1?f[1]=Math.max(f[1],k[1]):c.push(f=k);for(a=0;a<c.length;++a)k=
        c[a],b.push(g(k[0])),k[1]>k[0]&&(k[1]+1>k[0]&&b.push("-"),b.push(g(k[1])));b.push("]");return b.join("")}function h(e){for(var a=e.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g),b=a.length,d=[],f=0,k=0;f<b;++f){var m=a[f];"("===m?++k:"\\"===m.charAt(0)&&(m=+m.substring(1))&&(m<=k?d[m]=-1:a[f]=g(m))}for(f=1;f<d.length;++f)-1===d[f]&&(d[f]=++C);for(k=f=0;f<b;++f)m=a[f],"("===m?(++k,d[k]||(a[f]="(?:")):"\\"===m.charAt(0)&&(m=+m.substring(1))&&
    m<=k&&(a[f]="\\"+d[m]);for(f=0;f<b;++f)"^"===a[f]&&"^"!==a[f+1]&&(a[f]="");if(e.ignoreCase&&p)for(f=0;f<b;++f)m=a[f],e=m.charAt(0),2<=m.length&&"["===e?a[f]=c(m):"\\"!==e&&(a[f]=m.replace(/[A-Za-z]/g,function(a){a=a.charCodeAt(0);return"["+String.fromCharCode(a&-33,a|32)+"]"}));return a.join("")}for(var C=0,p=!1,l=!1,q=0,a=b.length;q<a;++q){var n=b[q];if(n.ignoreCase)l=!0;else if(/[a-z]/i.test(n.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi,""))){p=!0;l=!1;break}}for(var u={b:8,t:9,n:10,
    v:11,f:12,r:13},s=[],q=0,a=b.length;q<a;++q){n=b[q];if(n.global||n.multiline)throw Error(""+n);s.push("(?:"+h(n)+")")}return RegExp(s.join("|"),l?"gi":"g")}function V(b,d){function g(b){var a=b.nodeType;if(1==a){if(!c.test(b.className)){for(a=b.firstChild;a;a=a.nextSibling)g(a);a=b.nodeName.toLowerCase();if("br"===a||"li"===a)h[l]="\n",p[l<<1]=C++,p[l++<<1|1]=b}}else if(3==a||4==a)a=b.nodeValue,a.length&&(a=d?a.replace(/\r\n?/g,"\n"):a.replace(/[\t\n\r ]+/g," "),h[l]=a,p[l<<1]=C,C+=a.length,p[l++<<
    1|1]=b)}var c=/(?:^|\s)nocode(?:\s|$)/,h=[],C=0,p=[],l=0;g(b);return{a:h.join("").replace(/\n$/,""),d:p}}function J(b,d,g,c){d&&(b={a:d,e:b},g(b),c.push.apply(c,b.g))}function W(b){for(var d=void 0,g=b.firstChild;g;g=g.nextSibling)var c=g.nodeType,d=1===c?d?b:g:3===c?X.test(g.nodeValue)?b:d:d;return d===b?void 0:d}function E(b,d){function g(b){for(var l=b.e,h=[l,"pln"],a=0,n=b.a.match(r)||[],u={},s=0,e=n.length;s<e;++s){var z=n[s],y=u[z],w=void 0,f;if("string"===typeof y)f=!1;else{var k=c[z.charAt(0)];
    if(k)w=z.match(k[1]),y=k[0];else{for(f=0;f<C;++f)if(k=d[f],w=z.match(k[1])){y=k[0];break}w||(y="pln")}!(f=5<=y.length&&"lang-"===y.substring(0,5))||w&&"string"===typeof w[1]||(f=!1,y="src");f||(u[z]=y)}k=a;a+=z.length;if(f){f=w[1];var m=z.indexOf(f),D=m+f.length;w[2]&&(D=z.length-w[2].length,m=D-f.length);y=y.substring(5);J(l+k,z.substring(0,m),g,h);J(l+k+m,f,K(y,f),h);J(l+k+D,z.substring(D),g,h)}else h.push(l+k,y)}b.g=h}var c={},r;(function(){for(var g=b.concat(d),l=[],q={},a=0,n=g.length;a<n;++a){var u=
    g[a],s=u[3];if(s)for(var e=s.length;0<=--e;)c[s.charAt(e)]=u;u=u[1];s=""+u;q.hasOwnProperty(s)||(l.push(u),q[s]=h)}l.push(/[\S\s]/);r=U(l)})();var C=d.length;return g}function v(b){var d=[],g=[];b.tripleQuotedStrings?d.push(["str",/^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/,h,"'\""]):b.multiLineStrings?d.push(["str",/^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,
    h,"'\"`"]):d.push(["str",/^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/,h,"\"'"]);b.verbatimStrings&&g.push(["str",/^@"(?:[^"]|"")*(?:"|$)/,h]);var c=b.hashComments;c&&(b.cStyleComments?(1<c?d.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,h,"#"]):d.push(["com",/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\n\r]*)/,h,"#"]),g.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,h])):d.push(["com",
    /^#[^\n\r]*/,h,"#"]));b.cStyleComments&&(g.push(["com",/^\/\/[^\n\r]*/,h]),g.push(["com",/^\/\*[\S\s]*?(?:\*\/|$)/,h]));if(c=b.regexLiterals){var r=(c=1<c?"":"\n\r")?".":"[\\S\\s]";g.push(["lang-regex",RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*("+("/(?=[^/*"+c+"])(?:[^/\\x5B\\x5C"+c+"]|\\x5C"+r+"|\\x5B(?:[^\\x5C\\x5D"+c+"]|\\x5C"+
    r+")*(?:\\x5D|$))+/")+")")])}(c=b.types)&&g.push(["typ",c]);c=(""+b.keywords).replace(/^ | $/g,"");c.length&&g.push(["kwd",RegExp("^(?:"+c.replace(/[\s,]+/g,"|")+")\\b"),h]);d.push(["pln",/^\s+/,h," \r\n\t\u00a0"]);c="^.[^\\s\\w.$@'\"`/\\\\]*";b.regexLiterals&&(c+="(?!s*/)");g.push(["lit",/^@[$_a-z][\w$@]*/i,h],["typ",/^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/,h],["pln",/^[$_a-z][\w$@]*/i,h],["lit",/^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i,h,"0123456789"],["pln",/^\\[\S\s]?/,
    h],["pun",RegExp(c),h]);return E(d,g)}function L(b,d,g){function c(a){var b=a.nodeType;if(1==b&&!r.test(a.className))if("br"===a.nodeName)h(a),a.parentNode&&a.parentNode.removeChild(a);else for(a=a.firstChild;a;a=a.nextSibling)c(a);else if((3==b||4==b)&&g){var d=a.nodeValue,n=d.match(p);n&&(b=d.substring(0,n.index),a.nodeValue=b,(d=d.substring(n.index+n[0].length))&&a.parentNode.insertBefore(l.createTextNode(d),a.nextSibling),h(a),b||a.parentNode.removeChild(a))}}function h(b){function c(a,b){var d=
    b?a.cloneNode(!1):a,e=a.parentNode;if(e){var e=c(e,1),g=a.nextSibling;e.appendChild(d);for(var h=g;h;h=g)g=h.nextSibling,e.appendChild(h)}return d}for(;!b.nextSibling;)if(b=b.parentNode,!b)return;b=c(b.nextSibling,0);for(var d;(d=b.parentNode)&&1===d.nodeType;)b=d;a.push(b)}for(var r=/(?:^|\s)nocode(?:\s|$)/,p=/\r\n?|\n/,l=b.ownerDocument,q=l.createElement("li");b.firstChild;)q.appendChild(b.firstChild);for(var a=[q],n=0;n<a.length;++n)c(a[n]);d===(d|0)&&a[0].setAttribute("value",d);var u=l.createElement("ol");
    u.className="linenums";d=Math.max(0,d-1|0)||0;for(var n=0,s=a.length;n<s;++n)q=a[n],q.className="L"+(n+d)%10,q.firstChild||q.appendChild(l.createTextNode("\u00a0")),u.appendChild(q);b.appendChild(u)}function r(b,d){for(var g=d.length;0<=--g;){var c=d[g];H.hasOwnProperty(c)?F.console&&console.warn("cannot override language handler %s",c):H[c]=b}}function K(b,d){b&&H.hasOwnProperty(b)||(b=/^\s*</.test(d)?"default-markup":"default-code");return H[b]}function M(b){var d=b.h;try{var g=V(b.c,b.i),c=g.a;
    b.a=c;b.d=g.d;b.e=0;K(d,c)(b);var h=/\bMSIE\s(\d+)/.exec(navigator.userAgent),h=h&&8>=+h[1],d=/\n/g,r=b.a,p=r.length,g=0,l=b.d,q=l.length,c=0,a=b.g,n=a.length,u=0;a[n]=p;var s,e;for(e=s=0;e<n;)a[e]!==a[e+2]?(a[s++]=a[e++],a[s++]=a[e++]):e+=2;n=s;for(e=s=0;e<n;){for(var z=a[e],y=a[e+1],w=e+2;w+2<=n&&a[w+1]===y;)w+=2;a[s++]=z;a[s++]=y;e=w}a.length=s;var f=b.c,k;f&&(k=f.style.display,f.style.display="none");try{for(;c<q;){var m=l[c+2]||p,D=a[u+2]||p,w=Math.min(m,D),B=l[c+1],I;if(1!==B.nodeType&&(I=r.substring(g,
        w))){h&&(I=I.replace(d,"\r"));B.nodeValue=I;var N=B.ownerDocument,t=N.createElement("span");t.className=a[u+1];var v=B.parentNode;v.replaceChild(t,B);t.appendChild(B);g<m&&(l[c+1]=B=N.createTextNode(r.substring(w,m)),v.insertBefore(B,t.nextSibling))}g=w;g>=m&&(c+=2);g>=D&&(u+=2)}}finally{f&&(f.style.display=k)}}catch(x){F.console&&console.log(x&&x.stack||x)}}var F=window,A=["break,continue,do,else,for,if,return,while"],G=[[A,"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],
        "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],O=[G,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],P=[G,"abstract,assert,boolean,byte,extends,final,finally,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],
    Q=[P,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],G=[G,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],R=[A,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
    S=[A,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],Y=[A,"as,assert,const,copy,drop,enum,extern,fail,false,fn,impl,let,log,loop,match,mod,move,mut,priv,pub,pure,ref,self,static,struct,true,trait,type,unsafe,use"],A=[A,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],T=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,
    X=/\S/,Z=v({keywords:[O,Q,G,"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",R,S,A],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),H={};r(Z,["default-code"]);r(E([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\S\s]*?(?:--\>|$)/],["lang-",/^<\?([\S\s]+?)(?:\?>|$)/],["lang-",/^<%([\S\s]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",
    /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),"default-markup htm html mxml xhtml xml xsl".split(" "));r(E([["pln",/^\s+/,h," \t\r\n"],["atv",/^(?:"[^"]*"?|'[^']*'?)/,h,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],["pun",/^[/<->]+/],
    ["lang-js",/^on\w+\s*=\s*"([^"]+)"/i],["lang-js",/^on\w+\s*=\s*'([^']+)'/i],["lang-js",/^on\w+\s*=\s*([^\s"'>]+)/i],["lang-css",/^style\s*=\s*"([^"]+)"/i],["lang-css",/^style\s*=\s*'([^']+)'/i],["lang-css",/^style\s*=\s*([^\s"'>]+)/i]]),["in.tag"]);r(E([],[["atv",/^[\S\s]+/]]),["uq.val"]);r(v({keywords:O,hashComments:!0,cStyleComments:!0,types:T}),"c cc cpp cxx cyc m".split(" "));r(v({keywords:"null,true,false"}),["json"]);r(v({keywords:Q,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:T}),
    ["cs"]);r(v({keywords:P,cStyleComments:!0}),["java"]);r(v({keywords:A,hashComments:!0,multiLineStrings:!0}),["bash","bsh","csh","sh"]);r(v({keywords:R,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py","python"]);r(v({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:2}),["perl","pl","pm"]);r(v({keywords:S,
    hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb","ruby"]);r(v({keywords:G,cStyleComments:!0,regexLiterals:!0}),["javascript","js"]);r(v({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]);r(v({keywords:Y,cStyleComments:!0,multilineStrings:!0}),["rc","rs","rust"]);
    r(E([],[["str",/^[\S\s]+/]]),["regex"]);var $=F.PR={createSimpleLexer:E,registerLangHandler:r,sourceDecorator:v,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ",prettyPrintOne:F.prettyPrintOne=function(b,d,g){var c=document.createElement("div");c.innerHTML="<pre>"+b+"</pre>";c=c.firstChild;g&&L(c,g,!0);M({h:d,j:g,c:c,i:1});
        return c.innerHTML},prettyPrint:F.prettyPrint=function(b,d){function g(){for(var c=F.PR_SHOULD_USE_CONTINUATION?a.now()+250:Infinity;n<v.length&&a.now()<c;n++){for(var d=v[n],l=k,q=d;q=q.previousSibling;){var p=q.nodeType,t=(7===p||8===p)&&q.nodeValue;if(t?!/^\??prettify\b/.test(t):3!==p||/\S/.test(q.nodeValue))break;if(t){l={};t.replace(/\b(\w+)=([\w%+\-.:]+)/g,function(a,b,c){l[b]=c});break}}q=d.className;if((l!==k||e.test(q))&&!z.test(q)){p=!1;for(t=d.parentNode;t;t=t.parentNode)if(f.test(t.tagName)&&
        t.className&&e.test(t.className)){p=!0;break}if(!p){d.className+=" prettyprinted";p=l.lang;if(!p){var p=q.match(s),A;!p&&(A=W(d))&&w.test(A.tagName)&&(p=A.className.match(s));p&&(p=p[1])}if(y.test(d.tagName))t=1;else var t=d.currentStyle,x=r.defaultView,t=(t=t?t.whiteSpace:x&&x.getComputedStyle?x.getComputedStyle(d,h).getPropertyValue("white-space"):0)&&"pre"===t.substring(0,3);x=l.linenums;(x="true"===x||+x)||(x=(x=q.match(/\blinenums\b(?::(\d+))?/))?x[1]&&x[1].length?+x[1]:!0:!1);x&&L(d,x,t);u=
    {h:p,c:d,j:x,i:t};M(u)}}}n<v.length?setTimeout(g,250):"function"===typeof b&&b()}for(var c=d||document.body,r=c.ownerDocument||document,c=[c.getElementsByTagName("pre"),c.getElementsByTagName("code"),c.getElementsByTagName("xmp")],v=[],p=0;p<c.length;++p)for(var l=0,q=c[p].length;l<q;++l)v.push(c[p][l]);var c=h,a=Date;a.now||(a={now:function(){return+new Date}});var n=0,u,s=/\blang(?:uage)?-([\w.]+)(?!\S)/,e=/\bprettyprint\b/,z=/\bprettyprinted\b/,y=/pre|xmp/i,w=/^code$/i,f=/^(?:pre|code|xmp)$/i,
        k={};g()}};"function"===typeof define&&define.amd&&define("google-code-prettify",[],function(){return $})})()}();
