import ipfsApi from 'ipfs-api';

let ipfs = ipfsApi("ipfs.infura.io", "5001", {"protocol": "https"});

let ipfsPrefix = "https://ipfs.infura.io:5001/ipfs";

function saveImageToIpfs(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = Buffer.from(reader.result);
      const res = await ipfs.add(buffer); // 上传
      console.log(res);
      resolve(res[0].hash);
    }
  });
}

export { ipfs, ipfipfsPrefixsApi, saveImageToIpfs };