# Paratika-NODEJS-Entegresyonu

Merhabalar, maalesef ülkemizde nodejs ile alakalı kaynaklar oldukça kısıtlı bundan dolayı bu konu hakkında bir makale yazmanın sağlıklı olacağı düşüncesine vardım , bu yazımda [Paratika](https://www.paratika.com.tr/) sanal pos entegrasyonu ile çalışacağız, iyi okumalar.

### Çalışma Mantığı 

Paratika ödeme sisteminin adımlarına değinecek olursak bunu 3 madde de açıklayacağız 

1. Session Token Talep Edilmesi
2. 3D Secure Doğrulanması
3. 3D Secure Başarılı İse Yapılacak İşlemin Gerçekleşmesi (Satış, İptal)

İlk adımda bizden istenen zorunlu bilgiler ile Paratika'nın bize belirttiği url adresine istek atıp bir session token alacağız sonrasında bu token ile 3d secure için gerekli bilgileri Paratika'nın belirttiği 3d secure sayfasına göndereceğiz ve pozitif sonuç döndüğünde 3d secure sayfası açılacak ve kullanıcın kullanıcın kartının kayıtlı olduğu telefon numarasına sms kodu gönderilecek, kodu doğru girmesi sonucunda ise sistem kullanıcıyı bizim belirttiğimiz sayfaya yönlendirecek, bizde son işlemler yapıp para çekim işlemini gereçekleştireceğiz ve kullanıcıyı ödeme başarılı sayfasına yönlendireceğiz.

## 1. Session Token Talep Edilmesi

Paratikada işlem yapabilmek için token talep etmeliyiz ve bu token bizden zorunlu parametreler istemektedir , session token bizim gönderdiğimiz bilgileri tutacak bu sayede 3d secure sonrasında ödeme için ek olarak bir kullanıcının kart bilgilerini bir daha tutmamız gerekmemektedir. 

### İstenen Zorunlu Parametreler

**Not: Paratika hesabınıza giriş yaptıktan sonra kullanıcılar alanında bir merchant api user oluşturmanız gerekmektedir,paratika test kartları sunmaktadır lakin test kullanıcı(mağaza) sunmamaktadır , [TEST KARTLARI](https://vpos.paratika.com.tr/paratika/api/v2/doc#test-cards)

1. ACTION:SESSIONTOKEN => Action alani yapmak istediğimiz işlemi girdiğimiz alandır şuan session token talep edeceğiz
2. MERCHANTUSER => Paratika Mağaza Kullanıcısı
3. MERCHANTPASSWORD => Paratika Mağaza Şifre
4. MERCHANT => Paratika Mağaza Kodu
5. SESSIONTYPE:PAYMENTSESSION => Session istediğini cüzdan veya ödeme için olduğunu belirtmelisiniz biz burada ödeme için olduğunu belirteceğiz
6. RETURNURL => İşlem sonrasında kullanıcının gönderileceği alan 
7. MERCHANTPAYMENTID => Ödeme/sipariş kodu bu alanın benzersiz bir id olacağını unutmayın bunu yazılım tarafında ele alacağız
8. AMOUNT => Ödenecek para miktarı bu mikrata kdv dahil değildir ( gönderilecek para miktarı tipi => 15.00 )
9. CURRENCY => Para kodu, hangi para birimi ile ödeme yapılacağını buradan belirtmelisiniz (TRY,USD), desteklenen bütün para birimleri için **https://vpos.paratika.com.tr/paratika/api/v2/doc#session** alanındaki CURRENCY alanına bakmalısınız.
10. CUSTOMER => Müşteri numarası alanı bu alanında benzersiz id olması gerektiğini ve MERCHANTPAYMENTID ile aynı olmaması gerektiğini unutmayın.
11. CUSTOMEREMAIL => Müşteri e-mail adresi 
12. CUSTOMERNAME => Müşteri Adı 
13. CUSTOMERPHONE => Müşteri Telefon Numarası 
14. CUSTOMERIP => Müşteri İp Adresi 
15. ORDERITEMS => Ödeme yapılan ürün veya herhangi bir şey için gerekli detayları barındıran json verisi detayları kod tarafında göreceğiz 

### Nodojs Kodları 

#### Projemizi Kuralım 
```
npm init -y 
```
#### Paket Kurulumlarını Yapalım 

##### ExpressJs Paketi
Express Js paketini sistemden gelen verileri dinlemek için kullanacağız 

```
npm install express
```
##### Axios Paketi
Axios paketini kuralım, axios paketini post gönderme işlemleri için kullanacağız
```
npm install axios
```

#### Server Başlatılması Ve Html Tarafı 

index.js
```
const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(3030 , () =>{
    console.log('server working')
})
```
Burada 3030 portunda çalışacak serverı kuruyorum ve dosylarımızın içerisine açacağımız public dosyasının server çalıştırıldığında gösterilmesini söylüyoruz , public klasörürnün içerisinde ise html tarafı olacak. Son aşamada klasör yapısı şu şekildedir:

```
|- node_modules
|- pulic
  |-- html dosyalari
|-index.js
|-package-lock.json
|-package.json
```

## Html İle Form Oluşturma Kısmı

Evet şimdi kullanıcıdan session token için istenen alanların bulunduğu bir form alanı oluşturacağız bu form alanından gelen verileri axios ile backend kısmına gönderip sonrasında backend kısmında yakaladıktan sonra yine axios ile paratika sistemine göndericeğiz 

Şimdi public klasörünün içerisine index.html ve index.js sayfalarını oluşturuyoruz, index.html sayfasi session token için gerekli bilgileri alacak sonrasında diğer sayfada ise kullanıcıdan kart bilgileri alınıp 3d secure sayfasına gönderilecek, tabiki istediğinize göre bütün bilgileri tek sayfadada tamamlaya bilirsiniz lakin biz burada 2 sayfada yapacağız.

index.html sayfasındaki form bilgilerini index.js ile alıyoruz ve backend kısmına gönderiyoruz sonrsında ise token talebi için post işlemleri gerçekleşiyor, kod tarafında yorum satırları ile açıklamaya çalıştım lütfen bakınız :


#### Backend => [index.js](https://github.com/Vrm4/Paratika-NODEJS-Entegresyonu/blob/main/index.js)
#### index.html => [index.html](https://github.com/Vrm4/Paratika-NODEJS-Entegresyonu/blob/main/public/index.html)
#### Form alanindaki verileri backende gönderen js sayfası => [index.js](https://github.com/Vrm4/Paratika-NODEJS-Entegresyonu/blob/main/public/index.js)

/public/index.js sayfası tamamen ilk aşamada session token için gerekli bilgileri alıyor ve backend kısmına gönderiyor sonrasında [backend kısmında](https://github.com/Vrm4/Paratika-NODEJS-Entegresyonu/blob/8ce39479c153b1d3e4cfeda4b8b358c91af11fbb/index.js#L14) session token için gerekli post işlemleri gerçekleştiriliyor ve front-end kısmında token değeri session olarak atanıp kullanıcı kart bilgilerini girmesi için cart.html sayfasına yönlendiriliyor.

## Kart Bilgileri İçin Gerekli Form Alanı 

Session tokenı aldıktan sonra kullanıcıyı kart bilgileri girmesi için cart.html sayfasına yönlendiriyoruz sonrasında kullanıcın girdiği bilgiler doğru ise kullanıcı 3d secure sayfasına gönderilecek lakin unutmayın test ortamında bunları yaptığımız için gerçek kartları değil paratikanın verdiği test kartlarını kullanmalısınız. 

!! card.js sayfasında sadece session tokenı form alanının action alanına ekliyoruz 
[backend kısmında](https://github.com/Vrm4/Paratika-NODEJS-Entegresyonu/blob/main/public/card.html)

Bu sayfada gördürğünüz bilgiler ile 3d secure sayfası açılacak ve kullanıcının telefonuna gelen şifrenin girilmesi istenecek sonrasında sistem kullanıcıyı bizim belirttiğimiz url gönderecek.

## Son Aşama Ödeme Alınması

Kullanıcı bizim belirttiğimiz url adresine yönlendirildiğinde sessionToken ve auth3dToken ile yönlendirilecek card.html sayfasında savecard alanını true olarak gönderdiğimiz için kullanıcının kart bilgiler ibu tokenlarda saklı olacak sonrasında sadece sessionToken, action , auth3dToken bilgilerini göndererek ödemeyi almış olacağız 

Kullanıcıdan gelen bilgileri yakalamak ve ödeme almak için lütfen [Bakınız](https://github.com/Vrm4/Paratika-NODEJS-Entegresyonu/blob/8ce39479c153b1d3e4cfeda4b8b358c91af11fbb/index.js#L79)

