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
    .then(() => alert('basarili'))
    .catch(() => alert('bir hata olustu'))
})