import mariadb from 'mariadb';


  
  const pool = mariadb.createPool( {
    host: 'localhost',
    port: 3306,
    user: 'taskapp',
    database: 'task_app_data',
    password: 'Chiller@01'
  });

  export const connection = async () => {
    const connection = await pool.getConnection();
    return connection;
  };
 
  
  



