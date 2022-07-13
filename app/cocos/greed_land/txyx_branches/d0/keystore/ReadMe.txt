keystore
	pw:wyhg2018
	alias:wyhg
	alias_pw:wyhg2018
package
	name:com.woyou.happygame
	
encryptJs=true;
xxteaKey=c4daffa7-30bc-48;
zipCompressJs=true


devtools://devtools/bundled/inspector.html?v8only=true&ws=192.168.0.38:6086/00010002-0003-4004-8005-000600070008




=============================================================================================================================================================================================================
如何获取 SHA1  
https://lbs.amap.com/api/android-location-sdk/guide/create-project/get-key

-----------

I:\Java\jdk1.8.0_231\bin>keytool -list -v -keystore H:\txcg_trunk\client\keystore\wyhg.keystore
输入密钥库口令:
密钥库类型: jks
密钥库提供方: SUN

您的密钥库包含 1 个条目

别名: wyhg
创建日期: 2018-5-22
条目类型: PrivateKeyEntry
证书链长度: 1
证书[1]:
所有者: CN=woyou, OU=woyou, O=woyou, L=chengdu, ST=sichuan, C=CN
发布者: CN=woyou, OU=woyou, O=woyou, L=chengdu, ST=sichuan, C=CN
序列号: 721b2f70
有效期为 Tue May 22 09:25:24 CST 2018 至 Mon May 17 09:25:24 CST 2038
证书指纹:
         MD5:  70:27:39:68:A6:74:25:24:03:68:58:FF:CB:B9:75:E1
         SHA1: FA:61:B2:32:19:B2:F8:D7:96:9B:4C:72:3E:6D:07:88:DD:56:06:F7
         SHA256: 27:18:61:E1:C9:A6:47:CF:DF:9B:A5:AD:F6:F3:A4:7D:49:3C:32:71:2D:24:02:DB:A3:89:FB:BF:C7:45:AB:21
签名算法名称: SHA256withRSA
主体公共密钥算法: 1024 位 RSA 密钥
版本: 3

扩展:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: E9 E0 03 3D 35 46 14 91   9C B7 15 BC 60 16 D6 21  ...=5F......`..!
0010: 4F 55 88 FF                                        OU..
]
]



*******************************************
*******************************************



Warning:
JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore H:\txcg_trunk\client\keystore\wyhg.keystore -destkeystore H:\txcg_trunk\client\keystore\wyhg.keystore -deststoretype pkcs12" 迁移到行 业标准格式 PKCS12。

I:\Java\jdk1.8.0_231\bin>

====================================================================================================================================================================




apple account
quanyuwangluo6666@outlook.com
Cdcsd20!9

merrileenakealindseylupe@gmail.com
Tmv@12345

    // 苹果打包 拷贝以下代码到main.js 具体参考 copy_ios.jpg图片
	(function () {
		if (cc.sys.isNative && !cc.sys.curBuildVersion) {
			cc.sys.curBuildVersion = '1.0'; // 这个版本号，只能是大版本，不能带小版本，比如 版本号是1.5.0 那这里就得写成 1.5
			cc.sys.curDevMode = 'relese';
			var localBuildVersion = cc.sys.localStorage.getItem('currentVersion');
			if(localBuildVersion != null) {
				localBuildVersion = localBuildVersion.substr(0,localBuildVersion.lastIndexOf('.'));
				if(localBuildVersion == cc.sys.curBuildVersion) {
					var hotUpdateSearchPaths = cc.sys.localStorage.getItem('HotUpdateSearchPaths');
					if (hotUpdateSearchPaths) {
						jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
					}
				}
			} else {
				cc.sys.localStorage.clear();
			}
		}
	})();
	
	