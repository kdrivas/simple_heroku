fetch('/checkAuth').then(async (data) => {
  const text = await data.json()
  console.log(text['message'])
  if (text['message'] == 'error') {
    window.location.replace('/error_auth.html')
  }
})