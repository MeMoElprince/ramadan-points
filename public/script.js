const mongoose = require('mongoose');
const Schedule = require('../models/scheduleModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful!')).catch(err => console.log(err));

const scheduleData = [
    { day: 11, month: 3, year: 2024, name: "Fajr", time: "04:47 AM" },
    { day: 11, month: 3, year: 2024, name: "Dhuhr", time: "12:20 PM" },
    { day: 11, month: 3, year: 2024, name: "Asr", time: "03:50 PM" },
    { day: 11, month: 3, year: 2024, name: "Maghrib", time: "06:32 PM" },
    { day: 11, month: 3, year: 2024, name: "Isha", time: "07:50 PM" },
    { day: 12, month: 3, year: 2024, name: "Fajr", time: "04:48 AM" },
    { day: 12, month: 3, year: 2024, name: "Dhuhr", time: "12:19 PM" },
    { day: 12, month: 3, year: 2024, name: "Asr", time: "03:50 PM" },
    { day: 12, month: 3, year: 2024, name: "Maghrib", time: "06:31 PM" },
    { day: 12, month: 3, year: 2024, name: "Isha", time: "07:49 PM" },
    { day: 13, month: 3, year: 2024, name: "Fajr", time: "04:49 AM" },
    { day: 13, month: 3, year: 2024, name: "Dhuhr", time: "12:19 PM" },
    { day: 13, month: 3, year: 2024, name: "Asr", time: "03:49 PM" },
    { day: 13, month: 3, year: 2024, name: "Maghrib", time: "06:30 PM" },
    { day: 13, month: 3, year: 2024, name: "Isha", time: "07:47 PM" },
    { day: 14, month: 3, year: 2024, name: "Fajr", time: "04:49 AM" },
    { day: 14, month: 3, year: 2024, name: "Dhuhr", time: "12:19 PM" },
    { day: 14, month: 3, year: 2024, name: "Asr", time: "03:48 PM" },
    { day: 14, month: 3, year: 2024, name: "Maghrib", time: "06:29 PM" },
    { day: 14, month: 3, year: 2024, name: "Isha", time: "07:46 PM" },
    { day: 15, month: 3, year: 2024, name: "Fajr", time: "04:50 AM" },
    { day: 15, month: 3, year: 2024, name: "Dhuhr", time: "12:19 PM" },
    { day: 15, month: 3, year: 2024, name: "Asr", time: "03:48 PM" },
    { day: 15, month: 3, year: 2024, name: "Maghrib", time: "06:27 PM" },
    { day: 15, month: 3, year: 2024, name: "Isha", time: "07:45 PM" },
    { day: 16, month: 3, year: 2024, name: "Fajr", time: "04:51 AM" },
    { day: 16, month: 3, year: 2024, name: "Dhuhr", time: "12:18 PM" },
    { day: 16, month: 3, year: 2024, name: "Asr", time: "03:47 PM" },
    { day: 16, month: 3, year: 2024, name: "Maghrib", time: "06:26 PM" },
    { day: 16, month: 3, year: 2024, name: "Isha", time: "07:44 PM" },
    { day: 17, month: 3, year: 2024, name: "Fajr", time: "04:52 AM" },
    { day: 17, month: 3, year: 2024, name: "Dhuhr", time: "12:18 PM" },
    { day: 17, month: 3, year: 2024, name: "Asr", time: "03:47 PM" },
    { day: 17, month: 3, year: 2024, name: "Maghrib", time: "06:25 PM" },
    { day: 17, month: 3, year: 2024, name: "Isha", time: "07:42 PM" },
    { day: 18, month: 3, year: 2024, name: "Fajr", time: "04:52 AM" },
    { day: 18, month: 3, year: 2024, name: "Dhuhr", time: "12:18 PM" },
    { day: 18, month: 3, year: 2024, name: "Asr", time: "03:46 PM" },
    { day: 18, month: 3, year: 2024, name: "Maghrib", time: "06:24 PM" },
    { day: 18, month: 3, year: 2024, name: "Isha", time: "07:41 PM" },
    { day: 19, month: 3, year: 2024, name: "Fajr", time: "04:53 AM" },
    { day: 19, month: 3, year: 2024, name: "Dhuhr", time: "12:17 PM" },
    { day: 19, month: 3, year: 2024, name: "Asr", time: "03:45 PM" },
    { day: 19, month: 3, year: 2024, name: "Maghrib", time: "06:23 PM" },
    { day: 19, month: 3, year: 2024, name: "Isha", time: "07:40 PM" },
    { day: 20, month: 3, year: 2024, name: "Fajr", time: "04:54 AM" },
    { day: 20, month: 3, year: 2024, name: "Dhuhr", time: "12:17 PM" },
    { day: 20, month: 3, year: 2024, name: "Asr", time: "03:45 PM" },
    { day: 20, month: 3, year: 2024, name: "Maghrib", time: "06:21 PM" },
    { day: 20, month: 3, year: 2024, name: "Isha", time: "07:38 PM" },
    { day: 21, month: 3, year: 2024, name: "Fajr", time: "04:54 AM" },
    { day: 21, month: 3, year: 2024, name: "Dhuhr", time: "12:17 PM" },
    { day: 21, month: 3, year: 2024, name: "Asr", time: "03:44 PM" },
    { day: 21, month: 3, year: 2024, name: "Maghrib", time: "06:20 PM" },
    { day: 21, month: 3, year: 2024, name: "Isha", time: "07:37 PM" },
    { day: 22, month: 3, year: 2024, name: "Fajr", time: "04:55 AM" },
    { day: 22, month: 3, year: 2024, name: "Dhuhr", time: "12:17 PM" },
    { day: 22, month: 3, year: 2024, name: "Asr", time: "03:43 PM" },
    { day: 22, month: 3, year: 2024, name: "Maghrib", time: "06:19 PM" },
    { day: 22, month: 3, year: 2024, name: "Isha", time: "07:36 PM" },
    { day: 23, month: 3, year: 2024, name: "Fajr", time: "04:56 AM" },
    { day: 23, month: 3, year: 2024, name: "Dhuhr", time: "12:16 PM" },
    { day: 23, month: 3, year: 2024, name: "Asr", time: "03:42 PM" },
    { day: 23, month: 3, year: 2024, name: "Maghrib", time: "06:18 PM" },
    { day: 23, month: 3, year: 2024, name: "Isha", time: "07:35 PM" },
    { day: 24, month: 3, year: 2024, name: "Fajr", time: "04:56 AM" },
    { day: 24, month: 3, year: 2024, name: "Dhuhr", time: "12:16 PM" },
    { day: 24, month: 3, year: 2024, name: "Asr", time: "03:42 PM" },
    { day: 24, month: 3, year: 2024, name: "Maghrib", time: "06:17 PM" },
    { day: 24, month: 3, year: 2024, name: "Isha", time: "07:33 PM" },
    { day: 25, month: 3, year: 2024, name: "Fajr", time: "04:57 AM" },
    { day: 25, month: 3, year: 2024, name: "Dhuhr", time: "12:16 PM" },
    { day: 25, month: 3, year: 2024, name: "Asr", time: "03:41 PM" },
    { day: 25, month: 3, year: 2024, name: "Maghrib", time: "06:15 PM" },
    { day: 25, month: 3, year: 2024, name: "Isha", time: "07:32 PM" },
    { day: 26, month: 3, year: 2024, name: "Fajr", time: "04:58 AM" },
    { day: 26, month: 3, year: 2024, name: "Dhuhr", time: "12:15 PM" },
    { day: 26, month: 3, year: 2024, name: "Asr", time: "03:40 PM" },
    { day: 26, month: 3, year: 2024, name: "Maghrib", time: "06:14 PM" },
    { day: 26, month: 3, year: 2024, name: "Isha", time: "07:31 PM" },
    { day: 27, month: 3, year: 2024, name: "Fajr", time: "04:58 AM" },
    { day: 27, month: 3, year: 2024, name: "Dhuhr", time: "12:15 PM" },
    { day: 27, month: 3, year: 2024, name: "Asr", time: "03:39 PM" },
    { day: 27, month: 3, year: 2024, name: "Maghrib", time: "06:13 PM" },
    { day: 27, month: 3, year: 2024, name: "Isha", time: "07:30 PM" },
    { day: 28, month: 3, year: 2024, name: "Fajr", time: "04:59 AM" },
    { day: 28, month: 3, year: 2024, name: "Dhuhr", time: "12:15 PM" },
    { day: 28, month: 3, year: 2024, name: "Asr", time: "03:39 PM" },
    { day: 28, month: 3, year: 2024, name: "Maghrib", time: "06:12 PM" },
    { day: 28, month: 3, year: 2024, name: "Isha", time: "07:29 PM" },
    { day: 29, month: 3, year: 2024, name: "Fajr", time: "04:59 AM" },
    { day: 29, month: 3, year: 2024, name: "Dhuhr", time: "12:14 PM" },
    { day: 29, month: 3, year: 2024, name: "Asr", time: "03:38 PM" },
    { day: 29, month: 3, year: 2024, name: "Maghrib", time: "06:11 PM" },
    { day: 29, month: 3, year: 2024, name: "Isha", time: "07:27 PM" },
    { day: 30, month: 3, year: 2024, name: "Fajr", time: "05:00 AM" },
    { day: 30, month: 3, year: 2024, name: "Dhuhr", time: "12:14 PM" },
    { day: 30, month: 3, year: 2024, name: "Asr", time: "03:37 PM" },
    { day: 30, month: 3, year: 2024, name: "Maghrib", time: "06:09 PM" },
    { day: 30, month: 3, year: 2024, name: "Isha", time: "07:26 PM" },
    { day: 31, month: 3, year: 2024, name: "Fajr", time: "05:01 AM" },
    { day: 31, month: 3, year: 2024, name: "Dhuhr", time: "12:14 PM" },
    { day: 31, month: 3, year: 2024, name: "Asr", time: "03:36 PM" },
    { day: 31, month: 3, year: 2024, name: "Maghrib", time: "06:08 PM" },
    { day: 31, month: 3, year: 2024, name: "Isha", time: "07:25 PM" },
    { day: 1, month: 4, year: 2024, name: "Fajr", time: "05:01 AM" },
    { day: 1, month: 4, year: 2024, name: "Dhuhr", time: "12:14 PM" },
    { day: 1, month: 4, year: 2024, name: "Asr", time: "03:36 PM" },
    { day: 1, month: 4, year: 2024, name: "Maghrib", time: "06:07 PM" },
    { day: 1, month: 4, year: 2024, name: "Isha", time: "07:24 PM" },
    { day: 2, month: 4, year: 2024, name: "Fajr", time: "05:02 AM" },
    { day: 2, month: 4, year: 2024, name: "Dhuhr", time: "12:13 PM" },
    { day: 2, month: 4, year: 2024, name: "Asr", time: "03:35 PM" },
    { day: 2, month: 4, year: 2024, name: "Maghrib", time: "06:06 PM" },
    { day: 2, month: 4, year: 2024, name: "Isha", time: "07:23 PM" },
    { day: 3, month: 4, year: 2024, name: "Fajr", time: "05:02 AM" },
    { day: 3, month: 4, year: 2024, name: "Dhuhr", time: "12:13 PM" },
    { day: 3, month: 4, year: 2024, name: "Asr", time: "03:34 PM" },
    { day: 3, month: 4, year: 2024, name: "Maghrib", time: "06:05 PM" },
    { day: 3, month: 4, year: 2024, name: "Isha", time: "07:21 PM" },
    { day: 4, month: 4, year: 2024, name: "Fajr", time: "05:03 AM" },
    { day: 4, month: 4, year: 2024, name: "Dhuhr", time: "12:13 PM" },
    { day: 4, month: 4, year: 2024, name: "Asr", time: "03:33 PM" },
    { day: 4, month: 4, year: 2024, name: "Maghrib", time: "06:03 PM" },
    { day: 4, month: 4, year: 2024, name: "Isha", time: "07:20 PM" },
    { day: 5, month: 4, year: 2024, name: "Fajr", time: "05:03 AM" },
    { day: 5, month: 4, year: 2024, name: "Dhuhr", time: "12:12 PM" },
    { day: 5, month: 4, year: 2024, name: "Asr", time: "03:32 PM" },
    { day: 5, month: 4, year: 2024, name: "Maghrib", time: "06:02 PM" },
    { day: 5, month: 4, year: 2024, name: "Isha", time: "07:19 PM" },
    { day: 6, month: 4, year: 2024, name: "Fajr", time: "05:04 AM" },
    { day: 6, month: 4, year: 2024, name: "Dhuhr", time: "12:12 PM" },
    { day: 6, month: 4, year: 2024, name: "Asr", time: "03:32 PM" },
    { day: 6, month: 4, year: 2024, name: "Maghrib", time: "06:01 PM" },
    { day: 6, month: 4, year: 2024, name: "Isha", time: "07:18 PM" },
    { day: 7, month: 4, year: 2024, name: "Fajr", time: "05:05 AM" },
    { day: 7, month: 4, year: 2024, name: "Dhuhr", time: "12:12 PM" },
    { day: 7, month: 4, year: 2024, name: "Asr", time: "03:31 PM" },
    { day: 7, month: 4, year: 2024, name: "Maghrib", time: "06:00 PM" },
    { day: 7, month: 4, year: 2024, name: "Isha", time: "07:17 PM" },
    { day: 8, month: 4, year: 2024, name: "Fajr", time: "05:05 AM" },
    { day: 8, month: 4, year: 2024, name: "Dhuhr", time: "12:12 PM" },
    { day: 8, month: 4, year: 2024, name: "Asr", time: "03:30 PM" },
    { day: 8, month: 4, year: 2024, name: "Maghrib", time: "05:59 PM" },
    { day: 8, month: 4, year: 2024, name: "Isha", time: "07:16 PM" },
    { day: 9, month: 4, year: 2024, name: "Fajr", time: "05:06 AM" },
    { day: 9, month: 4, year: 2024, name: "Dhuhr", time: "12:11 PM" },
    { day: 9, month: 4, year: 2024, name: "Asr", time: "03:29 PM" },
    { day: 9, month: 4, year: 2024, name: "Maghrib", time: "05:58 PM" },
    { day: 9, month: 4, year: 2024, name: "Isha", time: "07:15 PM" }
];




const array = [];

for (let i = 0; i < scheduleData.length; i++) {
    const element = scheduleData[i];
    const {day, month, year, name, time} = element;
    const dateString = `${year}-${month}-${day} ${time}`;
    const date = new Date(dateString).getTime() / 1000;
    if(i % 5 === 0)
    {
        const obj = {
            date,
            name: `Part ${i / 5 + 1}`,
            long: 24 * 60 * 60
        }
        array.push(obj);
    }
    array.push({date, name});
}

for(let i = 0; i < array.length; i++) {

    if(array[i].long === 24 * 60 * 60) {
        array[i].points = 75;
        continue;
    }
    if(i < array.length - 1) {

        array[i].points = 25;
        array[i].long = array[i + 1].date - array[i].date;
        if(array[i].name === 'Fajr')
            array[i].long = 7200;
    }

}

array[array.length - 1].points = 25;
array[array.length - 1].long = 34980;

// console.log({array});
// Schedule.insertMany(array);