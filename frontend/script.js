function runTest() {
    const commands = document.getElementById('commands').value.split('\n');
    fetch('/run-test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stages: commands })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
