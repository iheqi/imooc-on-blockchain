import ipfsClient from 'ipfs-http-client';

// let ipfs = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
// let ipfsPrefix = "https://ipfs.infura.io:5001/ipfs/";

let ipfs = ipfsClient('localhost', '5002', { protocol: 'http' });
let ipfsPrefix = "http://localhost:5002/ipfs/";

function saveImageToIpfs(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = Buffer.from(reader.result);
      console.log(reader.result);
      const res = await ipfs.add(buffer); // 上传
      console.log(res);
      resolve(res[0].hash);
    }
  });
}

export { ipfs, ipfsPrefix, saveImageToIpfs };