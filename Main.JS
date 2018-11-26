var BigInteger = require('bigi'); //npm install --save bigi@1.1.0
var ecurve = require('ecurve') ;//npm install --save ecurve@1.0.0
var Point = require('ecurve/lib/point.js')
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
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
/******************fin hex encode***************************/
var Client = require('./Client.js')
var Admin = require('./Admin.js')
const Votant = new Client("hello");
console.log(Votant.publicKey().getEncoded(true).toString('hex'));
console.log(Votant.password());


/**********************ADMIN****************************** */

const admin = new Admin("hello");
console.log("**********************ADMIN*********************")
var pub=admin.publicKey().getEncoded(true).toString('hex');
console.log(pub)
var S_id=admin.Secret(pub);
console.log(S_id);



 /*****************PASSWORD BLOCKCHAIN ***********/
 var pass1 = Votant.passwordBlock(S_id);
 console.log(pass1.ciphertext.toString(CryptoJS.enc.Hex)+ "block")

/***************Account Blockchain************** */
console.log(Votant.CreateAccountBlock(pass1))
/*************CALCUL OFFSET & BN********************** */
var offset = admin.Offset()
console.log("/*************CALCUL OFFSET********************** */")
console.log(offset +"offseeeet")

var bn = admin.calculBN(pub);

var BN = bn.toString()
console.log("/************* BN********************** */")
console.log(BN+"         BN");
/*********************Encrypt Cj = H1(4)******************************* */
var qcj = Votant.calculQcj(); 
console.log("H1(cj) est ",qcj)


 
 
 /***********************BN Encrypt*************************/

 var epsilon = Votant.calculBNchiffré(BN,qcj);
 
 var epsilon2 = epsilon.toString() ; 
 console.log( "bn chiffre par le votant = " +  epsilon2  )
 
 var s0 = admin.calculQcj0() ; 
 var s1 = admin.calculQcj1() ; 
 var s2 = admin.calculQcj2() ; 
 var s3 = admin.calculQcj3() ; 
 var s4 = admin.calculQcj4() ; 
 var s5 = admin.calculQcj5() ; 
 
 /*******************dechiffBN************* */
 var BNdechiff = admin.decryptBN(s0,s1,s2,s3,s4,s5,epsilon2,BN);
 

 var dd = BNdechiff.toString(CryptoJS.enc.Utf8); 
 console.log("le bn dechii par l admin est ", dd);

 /**********************DECRYPT & GET GERM FROM Bn*************************** */
 var a=admin.getGermDecrypt(BNdechiff,pub);
 console.log("germ=    " +a);
 /***************************Recalcul OFFSET************************* */
 var off = admin.calculofff(a);
 console.log("offset dechifrre par l admin ", off); 
 
 /***************************GET du bulletin en rotation cj ************************* */
 var ccj = admin.getCj(BNdechiff); 
 console.log("le cj de bulletin en rotation est ", ccj) ; 


/***************************GET le vrai cj du bulletin original   ************************* */
var cj = admin.getCj2(ccj,off) ; 
console.log("le vrai cj  est", cj  ) ;
/********************************Calcul CVJ par l'administrateur ****************************** */
var cvj = admin.calculCVJ(BNdechiff,BNdechiff) ;
console.log("cvj calculé par admin", cvj ) ; 
/*********************************calcul cvj par le votant********************** */
var cvjj = Votant.calculCVJ2(BN,qcj )
console.log("le cvj de votant est ", cvjj) ;






/***********SMART CONTRACT********************* */
var CoursetroContract = web3.eth.contract([
    {
        "constant": true,
        "inputs": [
            {
                "name": "candidate",
                "type": "bytes32"
            }
        ],
        "name": "totalVotesFor",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "candidate",
                "type": "bytes32"
            }
        ],
        "name": "validCandidate",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "votesReceived",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidateList",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "candidate",
                "type": "bytes32"
            }
        ],
        "name": "voteForCandidate",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "candidateNames",
                "type": "bytes32[]"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
]);
        var vote = CoursetroContract.at('0x8275b543bb9651503ddd6000b7a9e1459cf05d77'); //SC @
