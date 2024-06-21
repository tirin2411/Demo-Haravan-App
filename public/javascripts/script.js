document.addEventListener('DOMContentLoaded', () => {
    // Đoạn mã JavaScript của bạn ở đây
    fetch('https://1ef0-14-161-37-191.ngrok-free.app/', {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 1
        }
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert('Data fetched successfully!');
    })
    .catch(error => console.error('Error:', error));
});
