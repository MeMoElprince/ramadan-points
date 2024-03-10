const Schedule = require('../models/scheduleModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');



exports.comming = catchAsync(async (req, res, next) => {
    const date = new Date().getTime() / 1000;
    // getting all schedules that are comming today and tomorrow (24 hours)
    // sorted by date from the nearest to the farthest
    // const schedules = await Schedule.aggregate([
    //     {
    //         $match: {
    //             date: { $gte: date },
    //             $expr: { $lt: [{ $subtract: ["$date", date] }, 86400] }
    //         }
    //     },
    //     {
    //         $sort: {
    //             date: 1
    //         }
    //     }
    // ]);
    const schedules = await Schedule.aggregate([
        {
            $match: {
                date: { $gt: date, $lte: date + 24 * 2 * 60 * 60 }
            }
        },
        {
            $sort: {
                date: 1
            }
        }
    ]);
    
    for(let i = 0; i < schedules.length; i++)
    {
        schedules[i].remaining = schedules[i].date - date;   
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            schedules
        }
    });
});

exports.running = catchAsync(async (req, res, next) => {
    const {user} = req;
    const date = new Date().getTime() / 1000;
    if(!user)
    {
        const schedules = await Schedule.aggregate([
            {
                $match: {
                    date: { $lte: date },
                    $expr: { $gt: [{ $add: ["$date", "$long"] }, date] }
                }
            },
            {
                $addFields: {
                    remaining: { $subtract: [{ $add: ["$date", "$long"] }, date] }
                }
            },
            {
                $sort: {
                    remaining: 1
                }
            }
        ]);


    
        for(let i = 0; i < schedules.length; i++)
        {
            schedules[i].remaining = schedules[i].date + schedules[i].long - date;   
        }


        return res.status(200).json({
            status: 'success',
            data: {
                schedules
            }
        });
    }

    // getting all schedules that are running now date less than or equal to now and long plus date greater than or equal to now
    // and the user has not this schedule in his list 
    const schedules = await Schedule.aggregate([
        {
            $match: {
                date: { $lte: date },
                $expr: { $gt: [{ $add: ["$date", "$long"] }, date] }
            }
        },
        {
            $addFields: {
                remaining: { $subtract: [{ $add: ["$date", "$long"] }, date] }
            }
        },
        {
            $sort: {
                remaining: 1
            }
        },
        {
            $match: {
                _id: { $nin: user.list }
            }
        }
    ]);
    for(let i = 0; i < schedules.length; i++)
    {
        schedules[i].remaining = schedules[i].date + schedules[i].long - date;   
    }
    res.status(200).json({
        status: 'success',
        data: {
            schedules
        }
    });
});

exports.acceptSchedule = catchAsync(async (req, res, next) => {
    const {user} = req;
    const {id} = req.params;
    const schedule = await Schedule.findById(id);
    if(!schedule) return next(new AppError('No schedule found with that ID', 404));
    if(user.list.includes(id)) return next(new AppError('You have already accepted this schedule', 400));
    user.list.push(id);
    user.points += schedule.points;
    await user.save({validateBeforeSave: false});
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });

});