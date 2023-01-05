const express = require('express')
const app = express()
const axios = require('axios')

app.use(express.static('public'))
app.use(express.json())

// kullanıcının ip adresini alıyoruz
const getIp = async () =>{
    const result = await axios.get('https://httpbin.org/ip')
    customerIp = result.data.origin
    return customerIp
}
app.post('/get-form' ,(req,res) =>{
    console.log(req.body)
    const date = new Date()
    /* 
    |---Gerekli bilgileri değişkenlere atıyoruz ----|
     */ 
    // mağaza numarası 
    const merchant = 100658785
    // mağaza kullanıcı adı (mail) 
    const merchantUser = 'api'
    // mağaza şifresi
    const merchantPass = 'TEST1111'
    // işlemler sonrasında gönderilecek url , burada gelen post verilerini dinleyeceğimiz için
    // bu alan backend tarafına yönlendiriliyor 
    const returnUrl = 'http://localhost:3030/return'
    // burada anlık zamanı aldığımız için bu veri benzersiz olacaktır 
    const merchantPaymentId = date.getTime()
    // kullanıcıdan aldığımız ücter miktarı 
    const amount = req.body.amount
    // para birimi (TRY,USD)
    const currency = req.body.currency
    // müşteri numarası buranında benzersiz olması gerekli 
    const customerId =  date.getTime() + 32
    // kullanıcı maili
    const customerMail = req.body.mail  
    // kullanıcı ad ve soyad 
    const customerNameAndSurname = req.body.nameAndSurname
    // kullanıcı telefon numarası
    const customerPhone = req.body.phone
    // kullanıcı ip adresi
    var customerIp ;
    // satın alınan ürün ile ilgili detaylar 
    // satın alınnan ürünler ile birden fazlaysa ve gerekli detaylar burada belirlenir 
    // productCode alanının benzersiz olması gerekli 
    const orderItems = [
        {
            "productCode": date.getTime() + 14, 
            "name": "Deneme", 
            "description": "Deneme", 
            "quantity": 1, 
            "amount": amount
        }
    ]
    // bir async fonksiyon daha oluşturarak ip alma işlemini ve session token için istek atıyoruz 
    const process = async () => {
        const ipS = await getIp();
        await axios.post('https://entegrasyon.paratika.com.tr/paratika/api/v2',
            `ACTION=SESSIONTOKEN&MERCHANT=${merchant}&MERCHANTUSER=${merchantUser}&MERCHANTPASSWORD=${merchantPass}
            &AMOUNT=${amount}&CURRENCY=${currency}&MERCHANTPAYMENTID=${merchantPaymentId}&RETURNURL=${returnUrl}
            &CUSTOMER=${customerId}&CUSTOMERNAME=${customerNameAndSurname}&CUSTOMEREMAIL=${customerMail}&SESSIONTYPE=PAYMENTSESSION
            &CUSTOMERIP=${ipS}&CUSTOMERPHONE=${customerPhone}&ORDERITEMS=${JSON.stringify(orderItems)}`,
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        )
        .then((result) => {
            // hata yoksa frontend tarafında session tokenı gönderiyoruz 
            if (result.data.responseCode === '00'){
                res.send({sessionToken : result.data.sessionToken})
            }  
        })
        .catch((err) => console.log(err))
    }
    process()
})
app.post('/return' , (req,res) => {
    // 3d secure sonrasında kullanıcı bu sayfaya yönlendirilecek ve bu sayfaya
    // 3d secureden sonuçlar post ile gelecek burada sonuçları yakalayıp ödeme işlemini gerçekleştireceğiz

    // bir hata durumu yoksa ödeme yapılacak 
    // son aşamada sadece sistemin bize gönderdiği session token , hangi işlemin yapılacağı ve auth3Dtoken değerini göndereceğiz
    // aşağıda göründüğü gibi 3 değeri göndermemiz bizim için yeterli bir hata dönmezse ödeme başarılı yazısını göstereceğiz
    if(req.body.responseCode === '00'){
        let resultData = `SESSIONTOKEN=${req.body.sessionToken}&ACTION=SALE&AUTH3DTOKEN=${req.body.auth3DToken}`
        
        axios.post('https://vpos.paratika.com.tr/paratika/api/v2',
        resultData,
        {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then((result) =>{ 
            res.redirect('/information.html')
        })
        .catch((err) =>{
            console.log('Ödeme Başarısız')
        })
    }
})
app.listen(3030 , () =>{
    console.log('server working')
})
