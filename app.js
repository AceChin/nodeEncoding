var fs=require('fs');
var data='';
var iconv = require('iconv-lite');
var path=require('path');

function encoding(file) {
   // var rs = await fs.createReadStream('00_z001b.ks');
  return new Promise((resolve,reject)=>{
    fs.readFile(`in/${file}`,(error,data)=>{
      error && reject(error)
      resolve(data)
    })
  })
 }
 

async function f(files) {
	let succeed = 0;
	let notKs = 0;
let sample = await new Promise((resolve,reject)=>{
    fs.readFile('sample.ks',(error,data)=>{
      error && reject(error)
      resolve(data)
    })
  })

for (let i = 0; i < files.length; i++) {
	let extname=path.extname(files[i]);
if (extname === '.ks') {
	let a = await encoding(files[i])
	let str = iconv.decode(new Buffer.from(a), 'Shift_JIS');
  	let buf = iconv.encode(str, 'utf16-le');
  	let ultimately = Buffer.concat([sample, buf])
  	 fs.writeFile(`out/${files[i]}`,ultimately,{encoding: ''},function(error){
	    if(error){
	      console.log(error);
	      return false;
	    }
	    succeed++;
    console.log('第'+succeed+'个写入成功');
    })
	} else {
		notKs++
	console.log('跳过'+notKs+'个非KS文件')
	}
}
}

fs.readdir('./in',(err,files)=>{
  if(err) throw err;
  f(files)
})
