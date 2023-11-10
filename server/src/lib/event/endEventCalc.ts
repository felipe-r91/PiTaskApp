import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'


export function EndEventCalc(startDate: string, startHour: string, totalHours: number) {

  const workHoursStart = 7
  const workHoursEnd = 16
  const workHoursJourney = workHoursEnd - workHoursStart
  const startEventDateTime = startDate.concat(' ').concat(startHour)
  var auxEventDateTime = startDate.concat(' ').concat(workHoursStart.toString()).concat(':00');
  var endEventDateTime = dayjs(auxEventDateTime);
  var startHourDay: number;
 
  dayjs.extend(relativeTime)
  const test = dayjs(startEventDateTime).from(dayjs(auxEventDateTime), true)
  var hourDiff = Number(test.substring(0, 2))
  if (hourDiff.toString() === 'NaN'){
    hourDiff = 0;
  }
  if (test === 'an hour'){
    hourDiff = 1;
  }


  while(totalHours > 0){
    
    if(totalHours > workHoursJourney || (hourDiff + totalHours) > workHoursJourney){
      endEventDateTime = dayjs(endEventDateTime).add(1, 'day')
      if( totalHours > workHoursJourney){
        if((endEventDateTime.date() - dayjs(startEventDateTime).date()) === 1 ){
          totalHours = (totalHours + hourDiff) - workHoursJourney
        }else{
          totalHours = totalHours - workHoursJourney
        }
      }else{
        totalHours = totalHours - (workHoursEnd - (dayjs(startEventDateTime).hour()))
      }
      
    }
    if((totalHours + hourDiff) <= workHoursJourney){
      if(endEventDateTime.date() > dayjs(startEventDateTime).date()){
        startHourDay = workHoursStart
      }else{
        startHourDay = (dayjs(startEventDateTime).hour())
      }
      const endDay = (dayjs(endEventDateTime).date())
      const endMonth = ((dayjs(endEventDateTime).month())+1)
      const endYear = (dayjs(endEventDateTime).year())
      const endDate = endYear.toString().concat('-').concat(endMonth.toString()).concat('-').concat(endDay.toString())
      var sum = startHourDay + totalHours
      var aux = endDate.concat(' ').concat(sum.toString()).concat(':00')
      endEventDateTime = dayjs(aux)
      
      totalHours = totalHours - totalHours
    }
    
  }
    
  const resEventDateTime = endEventDateTime.format('YYYY-MM-DDTHH:mm:ss')
  return resEventDateTime

      

}