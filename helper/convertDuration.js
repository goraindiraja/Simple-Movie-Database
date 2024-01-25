
const convertDuration = (totalMinutes) => {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${padTo2Digits(hours)} hrs ${padTo2Digits(minutes)} min`;
}

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}

module.exports = convertDuration