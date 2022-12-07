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

**Not: Paratika hesabınıza giriş yaptıktan sonra kullanıcılar alanında bir merchant api user oluşturmanız gerekmektedir, henüz hesabınız yoksa ve sadece test etmek istiyorsanız https://vpos.paratika.com.tr/paratika/api/v2/doc#test-cards adresinden ilgili bilgileri kullanbilirsiniz**

1. ACTION:SESSIONTOKEN => Action alani yapmak istediğimiz işlemi girdiğimiz alandır şuan session token talep edeceğiz
2. MERCHANTUSER => Paratika Mağaza Kullanıcısı
3. MERCHANTPASSWORD => Paratika Mağaza Şifre
4. MERCHANT => Paratika Mağaza Kodu
5. SESSIONTYPE:PAYMENTSESSION => Session istediğini cüzdan veya ödeme için olduğunu belirtmelisiniz biz burada ödeme için olduğunu belirteceğiz
6. RETURNURL => İşlem sonrasında kullanıcının gönderileceği alan 
7. MERCHANTPAYMENTID => Ödeme/sipariş kodu bu alanın benzersiz bir id olacağını unutmayın bunu yazılım tarafında ele alacağız
8. AMOUNT => Ödenecek para miktarı bu mikrata kdv dahil değildir ( gönderilecek para miktarı tipi => 15.00 )
9. CURRENCY => Para kodu, hangi para birimi ile ödeme yapılacağını buradan belirtmelisiniz (TRY,USD), desteklenen bütün para birimleri için ** https://vpos.paratika.com.tr/paratika/api/v2/doc#session ** alanındaki CURRENCY alanına bakmalısınız.
10. CUSTOMER => Müşteri numarası alanı bu alanında benzersiz id olması gerektiğini ve MERCHANTPAYMENTID ile aynı olmaması gerektiğini unutmayın.
11. CUSTOMEREMAIL => Müşteri e-mail adresi 
12. CUSTOMERNAME => Müşteri Adı 
13. CUSTOMERPHONE => Müşteri Telefon Numarası 
14. CUSTOMERIP => Müşteri İp Adresi 
15. ORDERITEMS => Ödeme yapılan ürün veya herhangi bir şey için gerekli detayları barındıran json verisi detayları kod tarafında göreceğiz 
Örnek orderitems json verisi: 
ORDERITEMS:  [ 
        { 
            "productCode": "T00D3AITCC", 
            "name": "Galaxy Note 3", 
            "description": "Description of Galaxy Note 3", 
            "quantity": 2, 
            "amount": 449.99
        }, 
       ]


