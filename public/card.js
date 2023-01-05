const form = document.querySelector('#firs-post')
// oluşturduğumuz form değerine bir action ekliyoruz isterseniz bunu siz js tarafında da yapabilir siniz.
form.action = `https://test.paratika.com.tr/paratika/api/v2/post/auth3d/${getValueOfCookie('sessionToken_paratika')}`

// cookie değerini okumak için fonksiyon
function getValueOfCookie(value){
    const cookies = document.cookie.split(';')
    .find( item => item.trim().startsWith(`${value}=`))
    ?.split('=')[1]   
    return cookies 
}