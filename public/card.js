
window.addEventListener('submit' , (e ) =>{
    e.preventDefault()
    formData =  new FormData()
    formData.append('pan' , e.target[0].value)
})