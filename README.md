# Paratika-NODEJS-Entegresyonu

Merhabalar, maalesef ülkemizde nodejs ile alakalı kaynaklar oldukça kısıtlı bundan dolayı bu konu hakkında bir makale yazmanın sağlıklı olacağı düşüncesine vardım , bu yazımda [Paratika](https://www.paratika.com.tr/) sanal pos entegrasyonu ile çalışacağız, iyi okumalar.

### Çalışma Mantığı 

Paratika ödeme sisteminin adımlarına değinecek olursak bunu 3 madde de açıklayacağız 

1. Session Token Talep Etmek İçin Gerekli Bilgilerin Alınması Ve Gönderilemsi
2. Alınan Token İle 3D Secure Sayfasının Açılması Ve Doğrulama İşleminin Gerçekleşmesi
3. 3D Secure Başarılı İse Son Adımda Yapılacak İşlemin Gerçekleşmesi (Satış, İptal)

Maddelerde belirtildiği gibi ilk adımda bizden istenen zorunlu bilgiler ile Paratika'nın bize belirttiği url adresine istek atıp bir session token alacağız sonrasında bu token ile 3d secure için gerekli bilgileri Paratika'nın belirttiği 3d secure sayfasına göndereceğiz ve pozitif sonuç döndüğünde 3d secure sayfası açılacak ve kullanıcın kullanıcın kartının kayıtlı olduğu telefon numarasına sms kodu gönderilecek, kodu doğru girmesi sonucunda ise sistem kullanıcıyı bizim belirttiğimiz sayfaya yönlendirecek, bizde son işlemler yapıp para çekim işlemini gereçekleştireceğiz ve kullanıcıyı ödeme başarılı sayfasına yönlendireceğiz.




