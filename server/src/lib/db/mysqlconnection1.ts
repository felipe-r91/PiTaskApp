import mariadb from 'mariadb';


  
  const pool = mariadb.createPool( {
    host: '127.0.0.1',
    port: 3306,
    user: 'taskapp',
    database: 'task_app_data',
    password: 'Chiller@01'
  });

  export const conn = async () => {
    const connection = await pool.getConnection();
    return connection;
  };
 
  
  



