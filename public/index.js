// index.html sayfasındaki form alanına erişiyoruz
const form = document.querySelector('#firs-post')

// form alanını dinliyoruz ve submit olduğu zaman istediğimiz işleri yapıyoruz
form.addEventListener('submit' , (e) =>{
    // submit sonrası sayfa yenilenmesini engelleme
    e.preventDefault()
    // gelen değerleri json objesi olarak backend tarafına göndereceğiz 
    // e.target ile değerleri yakalıyoruz
    const data = {
        amount : e.target[0].value,
        currency : e.target[1].value,
        nameAndSurname : e.target[2].value,
        mail : e.target[3].value ,
        phone : e.target[4].value
    }
    // axios paketi ile birlikte veriyi backend kımına gönderiyoruz
    axios.post('/get-form' , data)
    .then((res) => {
        
        // token değerine erişiyoruz
        const token = res.data.sessionToken
        //token değerini cookie ile tutuyoruz 
        document.cookie = `sessionToken_paratika=${token} ; path=/`
        // kart bilgileri için yönlendirme 
        setTimeout(() => {
            window.location.href = '/card.html'
        }, 1000);
    })
    .catch(() => alert('bir hata olustu'))
})

// cookie durumunu sorgulamak için
function checkCookie(cookieName){
    const query = document.cookie.split('; ')
    .some(item => item.trim().startsWith(`${cookieName}=`))
    return query
}
//ilgili cookie'i silmek için
function deleteCookie(){
    document.cookie = `sessionToken_paratika=; expires = Thu, 01 Jan 1970 00:00:00 GTM; path=/`
}
// cookie değerini almak için
function getValueOfCookie(value){
    const cookies = document.cookie.split(';')
    .find( item => item.trim().startsWith(`${value}=`))
    ?.split('=')[1]   
    return cookies 
}