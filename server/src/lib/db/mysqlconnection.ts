import mysql from 'mysql2';


  
  const pool = mysql.createPool( {
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'task_app_data',
    password: 'Chiller@01'
  });

  export const conn = pool.promise();
 
  
  



