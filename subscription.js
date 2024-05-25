// Init subscription-toast as bootstrap toast
const successToast = new bootstrap.Toast(document.getElementById('success-toast'), {
  autohide: false,
  delay: 5000
})
const failureToast = new bootstrap.Toast(document.getElementById('failure-toast'), {
  autohide: false,
  delay: 5000
})

function showFailureToast(msg) {
  failureToast._element.querySelector('.error-message').innerText = msg ?? "";
  failureToast.show();
}

function showSuccessToast(msg) {
  successToast._element.querySelector('.toast-body').innerText = msg ?? "";
  successToast.show();
}

function formDataToJson(formData) {
  let obj = Object.fromEntries(formData.entries());
  return JSON.stringify(obj);
}

// Handle subscription form submission
document.getElementById('subscription-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(e.target);
  //console.log(e.target)
  //console.log('formData:', formDataToJson(formData))

  // Send subscription request to server
  const response = await fetch('http://localhost:8888/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: formDataToJson(formData)
  }).catch((error) => {
    showFailureToast(error);
    return new Response({status: 404, statusText: error});
  })

  if (typeof(response.ok) === "boolean" && response.ok) {
    //console.log("response", response)
    const responseData = await response.text().catch(error => {
      //console.log('response.text() error:', error)
      return error;
    });

    //console.log('responseData:', responseData)

    if (responseData === 'done') {
      showSuccessToast(responseData);
    } else {
      showFailureToast(responseData);
    }
  } else {
    if (typeof(response.statusText) === 'string')
      showFailureToast(response.statusText);
  }
})
