const mongoose = require('mongoose');
const Schedule = require('../models/scheduleModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful!')).catch(err => console.log(err));

const scheduleData = [
    { day: 11, month: 3, year: 2024, name: "Fajr", time: "04:38 AM" },
    { day: 11, month: 3, year: 2024, name: "Sunrise", time: "06:05 AM" },
    { day: 11, month: 3, year: 2024, name: "Dhuhr", time: "12:01 PM" },
    { day: 11, month: 3, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 11, month: 3, year: 2024, name: "Maghrib", time: "05:57 PM" },
    { day: 11, month: 3, year: 2024, name: "Isha", time: "07:14 PM" },
    { day: 12, month: 3, year: 2024, name: "Fajr", time: "04:37 AM" },
    { day: 12, month: 3, year: 2024, name: "Sunrise", time: "06:04 AM" },
    { day: 12, month: 3, year: 2024, name: "Dhuhr", time: "12:01 PM" },
    { day: 12, month: 3, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 12, month: 3, year: 2024, name: "Maghrib", time: "05:57 PM" },
    { day: 12, month: 3, year: 2024, name: "Isha", time: "07:14 PM" },
    { day: 13, month: 3, year: 2024, name: "Fajr", time: "04:36 AM" },
    { day: 13, month: 3, year: 2024, name: "Sunrise", time: "06:03 AM" },
    { day: 13, month: 3, year: 2024, name: "Dhuhr", time: "12:00 PM" },
    { day: 13, month: 3, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 13, month: 3, year: 2024, name: "Maghrib", time: "05:58 PM" },
    { day: 13, month: 3, year: 2024, name: "Isha", time: "07:16 PM" },
    { day: 14, month: 3, year: 2024, name: "Fajr", time: "04:35 AM" },
    { day: 14, month: 3, year: 2024, name: "Sunrise", time: "06:02 AM" },
    { day: 14, month: 3, year: 2024, name: "Dhuhr", time: "11:59 AM" },
    { day: 14, month: 3, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 14, month: 3, year: 2024, name: "Maghrib", time: "05:58 PM" },
    { day: 14, month: 3, year: 2024, name: "Isha", time: "07:17 PM" },
    { day: 15, month: 3, year: 2024, name: "Fajr", time: "04:34 AM" },
    { day: 15, month: 3, year: 2024, name: "Sunrise", time: "06:01 AM" },
    { day: 15, month: 3, year: 2024, name: "Dhuhr", time: "12:00 PM" },
    { day: 15, month: 3, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 15, month: 3, year: 2024, name: "Maghrib", time: "05:59 PM" },
    { day: 15, month: 3, year: 2024, name: "Isha", time: "07:17 PM" },
    { day: 16, month: 3, year: 2024, name: "Fajr", time: "04:32 AM" },
    { day: 16, month: 3, year: 2024, name: "Sunrise", time: "05:59 AM" },
    { day: 16, month: 3, year: 2024, name: "Dhuhr", time: "11:59 AM" },
    { day: 16, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 16, month: 3, year: 2024, name: "Maghrib", time: "06:00 PM" },
    { day: 16, month: 3, year: 2024, name: "Isha", time: "07:18 PM" },
    { day: 17, month: 3, year: 2024, name: "Fajr", time: "04:31 AM" },
    { day: 17, month: 3, year: 2024, name: "Sunrise", time: "05:58 AM" },
    { day: 17, month: 3, year: 2024, name: "Dhuhr", time: "11:59 AM" },
    { day: 17, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 17, month: 3, year: 2024, name: "Maghrib", time: "06:01 PM" },
    { day: 17, month: 3, year: 2024, name: "Isha", time: "07:18 PM" },
    { day: 18, month: 3, year: 2024, name: "Fajr", time: "04:30 AM" },
    { day: 18, month: 3, year: 2024, name: "Sunrise", time: "05:57 AM" },
    { day: 18, month: 3, year: 2024, name: "Dhuhr", time: "11:59 AM" },
    { day: 18, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 18, month: 3, year: 2024, name: "Maghrib", time: "06:01 PM" },
    { day: 18, month: 3, year: 2024, name: "Isha", time: "07:19 PM" },
    { day: 19, month: 3, year: 2024, name: "Fajr", time: "04:28 AM" },
    { day: 19, month: 3, year: 2024, name: "Sunrise", time: "05:56 AM" },
    { day: 19, month: 3, year: 2024, name: "Dhuhr", time: "11:59 AM" },
    { day: 19, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 19, month: 3, year: 2024, name: "Maghrib", time: "06:02 PM" },
    { day: 19, month: 3, year: 2024, name: "Isha", time: "07:20 PM" },
    { day: 20, month: 3, year: 2024, name: "Fajr", time: "04:27 AM" },
    { day: 20, month: 3, year: 2024, name: "Sunrise", time: "05:54 AM" },
    { day: 20, month: 3, year: 2024, name: "Dhuhr", time: "11:58 AM" },
    { day: 20, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 20, month: 3, year: 2024, name: "Maghrib", time: "06:03 PM" },
    { day: 20, month: 3, year: 2024, name: "Isha", time: "07:21 PM" },
    { day: 21, month: 3, year: 2024, name: "Fajr", time: "04:26 AM" },
    { day: 21, month: 3, year: 2024, name: "Sunrise", time: "05:53 AM" },
    { day: 21, month: 3, year: 2024, name: "Dhuhr", time: "11:58 AM" },
    { day: 21, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 21, month: 3, year: 2024, name: "Maghrib", time: "06:03 PM" },
    { day: 21, month: 3, year: 2024, name: "Isha", time: "07:24 PM" },
    { day: 22, month: 3, year: 2024, name: "Fajr", time: "04:24 AM" },
    { day: 22, month: 3, year: 2024, name: "Sunrise", time: "05:52 AM" },
    { day: 22, month: 3, year: 2024, name: "Dhuhr", time: "11:58 AM" },
    { day: 22, month: 3, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 22, month: 3, year: 2024, name: "Maghrib", time: "06:02 PM" },
    { day: 22, month: 3, year: 2024, name: "Isha", time: "07:22 PM" },
    { day: 23, month: 3, year: 2024, name: "Fajr", time: "04:23 AM" },
    { day: 23, month: 3, year: 2024, name: "Sunrise", time: "05:51 AM" },
    { day: 23, month: 3, year: 2024, name: "Dhuhr", time: "11:57 AM" },
    { day: 23, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 23, month: 3, year: 2024, name: "Maghrib", time: "06:01 PM" },
    { day: 23, month: 3, year: 2024, name: "Isha", time: "07:20 PM" },
    { day: 24, month: 3, year: 2024, name: "Fajr", time: "04:22 AM" },
    { day: 24, month: 3, year: 2024, name: "Sunrise", time: "05:49 AM" },
    { day: 24, month: 3, year: 2024, name: "Dhuhr", time: "11:57 AM" },
    { day: 24, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 24, month: 3, year: 2024, name: "Maghrib", time: "06:05 PM" },
    { day: 24, month: 3, year: 2024, name: "Isha", time: "07:23 PM" },
    { day: 25, month: 3, year: 2024, name: "Fajr", time: "04:20 AM" },
    { day: 25, month: 3, year: 2024, name: "Sunrise", time: "05:48 AM" },
    { day: 25, month: 3, year: 2024, name: "Dhuhr", time: "11:57 AM" },
    { day: 25, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 25, month: 3, year: 2024, name: "Maghrib", time: "06:06 PM" },
    { day: 25, month: 3, year: 2024, name: "Isha", time: "07:24 PM" },
    { day: 26, month: 3, year: 2024, name: "Fajr", time: "04:19 AM" },
    { day: 26, month: 3, year: 2024, name: "Sunrise", time: "05:47 AM" },
    { day: 26, month: 3, year: 2024, name: "Dhuhr", time: "11:56 AM" },
    { day: 26, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 26, month: 3, year: 2024, name: "Maghrib", time: "06:07 PM" },
    { day: 26, month: 3, year: 2024, name: "Isha", time: "07:44 PM" },
    { day: 27, month: 3, year: 2024, name: "Fajr", time: "04:18 AM" },
    { day: 27, month: 3, year: 2024, name: "Sunrise", time: "05:46 AM" },
    { day: 27, month: 3, year: 2024, name: "Dhuhr", time: "11:56 AM" },
    { day: 27, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 27, month: 3, year: 2024, name: "Maghrib", time: "06:08 PM" },
    { day: 27, month: 3, year: 2024, name: "Isha", time: "07:42 PM" },
    { day: 28, month: 3, year: 2024, name: "Fajr", time: "04:16 AM" },
    { day: 28, month: 3, year: 2024, name: "Sunrise", time: "05:45 AM" },
    { day: 28, month: 3, year: 2024, name: "Dhuhr", time: "11:56 AM" },
    { day: 28, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 28, month: 3, year: 2024, name: "Maghrib", time: "06:08 PM" },
    { day: 28, month: 3, year: 2024, name: "Isha", time: "07:41 PM" },
    { day: 29, month: 3, year: 2024, name: "Fajr", time: "04:15 AM" },
    { day: 29, month: 3, year: 2024, name: "Sunrise", time: "05:43 AM" },
    { day: 29, month: 3, year: 2024, name: "Dhuhr", time: "11:56 AM" },
    { day: 29, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 29, month: 3, year: 2024, name: "Maghrib", time: "06:23 PM" },
    { day: 29, month: 3, year: 2024, name: "Isha", time: "07:40 PM" },
    { day: 30, month: 3, year: 2024, name: "Fajr", time: "04:14 AM" },
    { day: 30, month: 3, year: 2024, name: "Sunrise", time: "05:42 AM" },
    { day: 30, month: 3, year: 2024, name: "Dhuhr", time: "11:55 AM" },
    { day: 30, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 30, month: 3, year: 2024, name: "Maghrib", time: "06:21 PM" },
    { day: 30, month: 3, year: 2024, name: "Isha", time: "07:38 PM" },
    { day: 31, month: 3, year: 2024, name: "Fajr", time: "04:12 AM" },
    { day: 31, month: 3, year: 2024, name: "Sunrise", time: "05:41 AM" },
    { day: 31, month: 3, year: 2024, name: "Dhuhr", time: "11:55 AM" },
    { day: 31, month: 3, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 31, month: 3, year: 2024, name: "Maghrib", time: "06:20 PM" },
    { day: 31, month: 3, year: 2024, name: "Isha", time: "07:37 PM" },
    { day: 1, month: 4, year: 2024, name: "Fajr", time: "04:11 AM" },
    { day: 1, month: 4, year: 2024, name: "Sunrise", time: "05:40 AM" },
    { day: 1, month: 4, year: 2024, name: "Dhuhr", time: "11:55 AM" },
    { day: 1, month: 4, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 1, month: 4, year: 2024, name: "Maghrib", time: "06:19 PM" },
    { day: 1, month: 4, year: 2024, name: "Isha", time: "07:36 PM" },
    { day: 2, month: 4, year: 2024, name: "Fajr", time: "04:10 AM" },
    { day: 2, month: 4, year: 2024, name: "Sunrise", time: "05:38 AM" },
    { day: 2, month: 4, year: 2024, name: "Dhuhr", time: "11:54 AM" },
    { day: 2, month: 4, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 2, month: 4, year: 2024, name: "Maghrib", time: "06:18 PM" },
    { day: 2, month: 4, year: 2024, name: "Isha", time: "07:35 PM" },
    { day: 3, month: 4, year: 2024, name: "Fajr", time: "04:07 AM" },
    { day: 3, month: 4, year: 2024, name: "Sunrise", time: "05:36 AM" },
    { day: 3, month: 4, year: 2024, name: "Dhuhr", time: "11:54 AM" },
    { day: 3, month: 4, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 3, month: 4, year: 2024, name: "Maghrib", time: "06:17 PM" },
    { day: 3, month: 4, year: 2024, name: "Isha", time: "07:33 PM" },
    { day: 4, month: 4, year: 2024, name: "Fajr", time: "04:05 AM" },
    { day: 4, month: 4, year: 2024, name: "Sunrise", time: "05:35 AM" },
    { day: 4, month: 4, year: 2024, name: "Dhuhr", time: "11:54 AM" },
    { day: 4, month: 4, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 4, month: 4, year: 2024, name: "Maghrib", time: "06:15 PM" },
    { day: 4, month: 4, year: 2024, name: "Isha", time: "07:32 PM" },
    { day: 5, month: 4, year: 2024, name: "Fajr", time: "04:04 AM" },
    { day: 5, month: 4, year: 2024, name: "Sunrise", time: "05:34 AM" },
    { day: 5, month: 4, year: 2024, name: "Dhuhr", time: "11:53 AM" },
    { day: 5, month: 4, year: 2024, name: "Asr", time: "03:26 PM" },
    { day: 5, month: 4, year: 2024, name: "Maghrib", time: "06:14 PM" },
    { day: 5, month: 4, year: 2024, name: "Isha", time: "07:31 PM" },
    { day: 6, month: 4, year: 2024, name: "Fajr", time: "04:03 AM" },
    { day: 6, month: 4, year: 2024, name: "Sunrise", time: "05:32 AM" },
    { day: 6, month: 4, year: 2024, name: "Dhuhr", time: "11:53 AM" },
    { day: 6, month: 4, year: 2024, name: "Asr", time: "03:25 PM" },
    { day: 6, month: 4, year: 2024, name: "Maghrib", time: "06:13 PM" },
    { day: 6, month: 4, year: 2024, name: "Isha", time: "07:30 PM" },
    { day: 7, month: 4, year: 2024, name: "Fajr", time: "04:02 AM" },
    { day: 7, month: 4, year: 2024, name: "Sunrise", time: "05:31 AM" },
    { day: 7, month: 4, year: 2024, name: "Dhuhr", time: "11:53 AM" },
    { day: 7, month: 4, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 7, month: 4, year: 2024, name: "Maghrib", time: "06:12 PM" },
    { day: 7, month: 4, year: 2024, name: "Isha", time: "07:29 PM" },
    { day: 8, month: 4, year: 2024, name: "Fajr", time: "04:01 AM" },
    { day: 8, month: 4, year: 2024, name: "Sunrise", time: "05:30 AM" },
    { day: 8, month: 4, year: 2024, name: "Dhuhr", time: "11:53 AM" },
    { day: 8, month: 4, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 8, month: 4, year: 2024, name: "Maghrib", time: "06:11 PM" },
    { day: 8, month: 4, year: 2024, name: "Isha", time: "07:27 PM" },
    { day: 9, month: 4, year: 2024, name: "Fajr", time: "04:00 AM" },
    { day: 9, month: 4, year: 2024, name: "Sunrise", time: "05:29 AM" },
    { day: 9, month: 4, year: 2024, name: "Dhuhr", time: "11:53 AM" },
    { day: 9, month: 4, year: 2024, name: "Asr", time: "03:24 PM" },
    { day: 9, month: 4, year: 2024, name: "Maghrib", time: "06:09 PM" },
    { day: 9, month: 4, year: 2024, name: "Isha", time: "07:26 PM" }
];




const array = [];

for (let i = 0; i < scheduleData.length; i++) {
    const element = scheduleData[i];
    const {day, month, year, name, time} = element;
    const dateString = `${year}-${month}-${day} ${time}`;
    const date = new Date(dateString).getTime() / 1000;
    if(i % 6 === 0)
    {
        const obj = {
            date,
            name: `Part ${i / 6 + 1}`,
            long: 24 * 60 * 60
        }
        array.push(obj);
    }
    if(name === 'Sunrise')
        continue;
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
array[array.length - 1].long = 30780;

// console.log({array});
// Schedule.insertMany(array);