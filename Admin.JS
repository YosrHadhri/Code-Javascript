function Admin (ID) 
{ this.ID=ID }

/****************GENERATE GERME */
 
 
generateGerm =function(){
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 var key = ec.genKeyPair();
 var g = key.getPublic();
 var x1 = g.getX();
 var tx1= x1.toString('hex');
 var t2x1 = new Buffer(tx1, 'hex');
 var bx1= BigInteger.fromBuffer(t2x1);
 var y1 = g.getY();
 var ty1= y1.toString('hex');
 var t2y1 = new Buffer(ty1, 'hex');
 var by1= BigInteger.fromBuffer(t2y1);
 var pt = new Point(ecparams,bx1,by1,BigInteger.ONE);
 var bool = ecparams.isOnCurve(pt);
 if (bool == true)
 {return g;}
 
 else 
 {
 return generateGerm() ;}}
 
 
 var g1 =generateGerm();
 
/**************** FIN GENERATE GERME ***************************************/
 /************hex encode*************/
 String.prototype.hexEncode = function(){
 var hex, i;
 
 var result = "";
 for (i=0; i<this.length; i++) {
 hex = this.charCodeAt(i).toString(16);
 result += ("000"+hex).slice(-4);
 }
 
 return result
 }
 /************ FIN hex encode*************/
 

 /*******************CALCUL PUBLIC KEY : RETURN point ********************************* */
 Admin.prototype.publicKey = function () {
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 var privateKey = new Buffer(this.ID.hexEncode(), 'hex');
 var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey));// yehseb publicKey bi formule G*privateKey

 return curvePt 
 }


 /*********************************CALCUL (S.id) ******************************************************** */
 Admin.prototype.Secret = function (pass) {
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var pt=this.publicKey();
 var resu =pt.multiply(BigInteger.fromBuffer(pass.hexEncode())) ;
 var ResulFinal = resu.getEncoded(true);
 return ResulFinal.toString('hex') ;
 }


 
 
 /************************************CALCUL OFFSET***************************************************** */

 Admin.prototype.Offset = function ()
 {var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var pubpt1 = g1; 
 console.log(g1+'interieur offset ****************************************')
 var t1x = pubpt1.getX().toString('hex');
 var t1y = pubpt1.getY().toString('hex');
 var c1x=new Buffer(t1x, 'hex');
 var c1y= new Buffer(t1y, 'hex');
 var ccc1 = Buffer.concat([new Buffer([0x04]), c1x, c1y]);
 var low = ccc1.toString('hex');
 var b36 = parseInt(low,16).toString(36);
 /******************************BINAIRE************************************* */
 function text2Binary(string) { // fonction qui convertit un string en binaire 
 var byte=""
 for (var i=0; i<string.length; i++) {
 
 byte+= string.charCodeAt(i).toString(2);}
 return byte}
 /******************************FIN BINAIRE********************* */ 
 
 var low1 = text2Binary(b36); // le g1 en binaire
 console.log("je suis le 1 er germe" ,low1);

 var sh1 = CryptoJS.SHA256(low1); //hashage de g1 
 var offset = sh1.toString(CryptoJS.enc.Hex); //extraction 
 var yourNumber = parseInt(offset, 16);// conversion en decimal 
 console.log("youuu number ", yourNumber );
 var offsetfinal = yourNumber % 6 ; // offset 
 return offsetfinal
 } 
 /************************************ FIN CALCUL OFFSET***************************************************** */

/********************************CALCUL BN ********************* */


Admin.prototype.calculBN = function (pub) {
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 console.log(g1+'interieur bn ****************************************')
 var pubpt1 = g1; 
 var t1x = pubpt1.getX().toString('hex');
 var t1y = pubpt1.getY().toString('hex');
 var c1x=new Buffer(t1x, 'hex');
 var c1y= new Buffer(t1y, 'hex');
 var ccc1 = Buffer.concat([new Buffer([0x04]), c1x, c1y]);
 var low = ccc1.toString('hex');
 var b36 = parseInt(low,16).toString(36);

 /******************************TEXT 2 BINAIRE********************* */


 function text2Binary(string) { // fonction qui convertit un string en binaire 
 var byte=""
 for (var i=0; i<string.length; i++) {
 
 byte+= string.charCodeAt(i).toString(2);}
 return byte}
 /******************************FIN BINAIRE********************* */ 
 
 var low1 = text2Binary(b36); // le g1 en binaire
 console.log( "je suis low 1 ", low1)
 var encrypted = CryptoJS.AES.encrypt(low1,pub);
 
return encrypted;

}



/***************************DECRYPT BN & GET BN************************** 
 * 
 */
 Admin.prototype.calculQcj0= function(){
 var Cj = "0"; 
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 
 var bu= new Buffer(Cj.hexEncode(), 'hex');
 
 var ecparams = ecurve.getCurveByName('secp256k1');
 var Qcjpt = ecparams.G.multiply(BigInteger.fromBuffer(bu));// yehseb publicKey bi formule G*privateKey
 var Qcjobject= Qcjpt.getEncoded(true);
 var Qcj=Qcjobject.toString('hex');
 return Qcj;}
 Admin.prototype.calculQcj1= function(){
 var Cj = "1"; 
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 
 var bu= new Buffer(Cj.hexEncode(), 'hex');
 
 var ecparams = ecurve.getCurveByName('secp256k1');
 var Qcjpt = ecparams.G.multiply(BigInteger.fromBuffer(bu));// yehseb publicKey bi formule G*privateKey
 var Qcjobject= Qcjpt.getEncoded(true);
 var Qcj=Qcjobject.toString('hex');
 
 return Qcj;}
 Admin.prototype.calculQcj2= function(){
 var Cj = "2"; 
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 
 var bu= new Buffer(Cj.hexEncode(), 'hex');
 
 var ecparams = ecurve.getCurveByName('secp256k1');
 var Qcjpt = ecparams.G.multiply(BigInteger.fromBuffer(bu));// yehseb publicKey bi formule G*privateKey
 var Qcjobject= Qcjpt.getEncoded(true);
 var Qcj=Qcjobject.toString('hex');
 
 return Qcj;}
 Admin.prototype.calculQcj3= function(){
 var Cj = "3"; 
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 
 var bu= new Buffer(Cj.hexEncode(), 'hex');
 
 var ecparams = ecurve.getCurveByName('secp256k1');
 var Qcjpt = ecparams.G.multiply(BigInteger.fromBuffer(bu));// yehseb publicKey bi formule G*privateKey
 var Qcjobject= Qcjpt.getEncoded(true);
 var Qcj=Qcjobject.toString('hex');
 
 return Qcj;}
 Admin.prototype.calculQcj4= function(){
 var Cj = "4"; 
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 
 var bu= new Buffer(Cj.hexEncode(), 'hex');
 
 var ecparams = ecurve.getCurveByName('secp256k1');
 var Qcjpt = ecparams.G.multiply(BigInteger.fromBuffer(bu));// yehseb publicKey bi formule G*privateKey
 var Qcjobject= Qcjpt.getEncoded(true);
 var Qcj=Qcjobject.toString('hex');
 
 return Qcj;}

 Admin.prototype.calculQcj5= function(){
 var Cj = "5"; 
 var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 
 var bu= new Buffer(Cj.hexEncode(), 'hex');
 
 var ecparams = ecurve.getCurveByName('secp256k1');
 var Qcjpt = ecparams.G.multiply(BigInteger.fromBuffer(bu));// yehseb publicKey bi formule G*privateKey
 var Qcjobject= Qcjpt.getEncoded(true);
 var Qcj=Qcjobject.toString('hex');
 
 return Qcj;}



 Admin.prototype.decryptBN=function(s0,s1,s2,s3,s4,s5,bnchiff,bn){
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 var tab = [];
 tab[0]=s0 ; 
 tab[1]=s1 ;
 tab[2]=s2 ;
 tab[3]=s3 ;
 tab[4]=s4 ;
 var t = []
 var i = 0 ;
 while ( i < tab.length) {
 try{
 
 var decrypted = CryptoJS.AES.decrypt(bnchiff,tab[i]);
 var c = decrypted.toString(CryptoJS.enc.Utf8);}
 catch(e){
 console.log ( "merooor je suis passé ");
 } 
 console.log("hahahhahaha",c) 
 if (c == bn ) {t[0]= c; 
 console.log("iiiiiiii",i)
 t[1]= i ; 
 return t }
 else (i++) ; }
 return t ; }



/***************************GET GERM************************* */


Admin.prototype.getGermDecrypt=function(t,publicKey){
 var AES = require("crypto-js/aes");
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 var bn1 = t[0] ; 
 var decrypted = CryptoJS.AES.decrypt(bn1,publicKey); 
 var c = decrypted.toString(CryptoJS.enc.Utf8) 
 return c 
 }
 
 /***************************Recalcul OFFSET************************* */

Admin.prototype.calculofff=function(g11){
 console.log("hyyyyyy")
 var SHA256 = require("crypto-js/sha256");
 var CryptoJS = require("crypto-js");
 var sh1 = CryptoJS.SHA256(g11); //hashage de g1 
 var offset = sh1.toString(CryptoJS.enc.Hex); //extraction 
 var yourNumber = parseInt(offset, 16);// conversion en decimal 
 console.log("your number 2 ", yourNumber);
 var offsetfinal = yourNumber % 6 ; // offset 
 return offsetfinal
 } 
 
/***************************GET du bulletin en rotation cj ************************* */
Admin.prototype.getCj=function(t){
 var cj = t[1]
 return cj ;}
 /***************************GET le vrai cj du bulletin original ************************* */
 Number.prototype.mod = function(n) {
 return (( this % n ) + n ) % n;
 };
Admin.prototype.getCj2=function(cj , offset ){
 var t = cj - offset ;
 
 var cj2= ( parseInt( t).mod(6) )
 //console.log("coucouuuu", cj2) ;
 return cj2 ;}


/***************************Recalcul OFFSET************************* 
*/
Admin.prototype.calculCVJ=function(bnn,t) {
 var namej = "mahdi" ; 
 var s = t[1] ; 
 var ss = s.toString()
var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
 var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
 var Point = require('ecurve/lib/point.js')
 var EC = require('elliptic').ec;
 var ec = new EC('secp256k1');
 var ecparams = ecurve.getCurveByName('secp256k1');
 var bn = bnn[0] ; 
 var bn2= new Buffer(bn.hexEncode(), 'hex');
 var qbn = ecparams.G.multiply(BigInteger.fromBuffer(bn2));
 var namej2= new Buffer(namej.hexEncode(),'hex');
 var qnamej = ecparams.G.multiply(BigInteger.fromBuffer(namej2));
 var sss = new Buffer(ss.hexEncode(), 'hex');
 var ssss = ecparams.G.multiply(BigInteger.fromBuffer(sss));
 var sssss = ssss.getEncoded(true).toString('hex') ; 
 var s1 = new Buffer (sssss.hexEncode(), 'hex') ; 
 var resu =qbn.multiply(BigInteger.fromBuffer(s1)) ;
 
 var cvj = qnamej.add(resu);
 var cvj2= cvj.getEncoded(true).toString('hex') ; 
 yourNumber = parseInt(cvj2, 10);
 
 return yourNumber;
 
 
 
 }







module.exports = Admin
