import mariadb from 'mariadb';


  
  const pool = mariadb.createPool( {
    host: '0.0.0.0',
    port: 3306,
    user: 'taskapp',
    database: 'task_app_data',
    password: 'Chiller@01',
    connectionLimit: 40,
  });

  export const connection = async () => {
    const connection = await pool.getConnection();
    return connection;
  };
 
  
  



