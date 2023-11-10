/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  
  theme: {
    fontFamily:{
      'sans': ["DM sans"]
    },
    extend: {
      colors:{
        'off-white': 'rgba(243, 247, 250, 1)',
        'purple-xdark' : '#23235F',
        'purple-dark': '#232360',
        'gray-light': '#8C97A8',
        'purple-light': '#5051F9',
        'dashboard-icon' : '#F3F7FD',
        'dasboard-value' : '#1E1E1E',
        
      },
      spacing:{
        'custom':'80px',
        'custom1': '274px',
        'background-w' : '960px',
        'custom3' : '1207px',
        'custom4': '819px',
        'custom5': '395px',
        'graphic-w': '885px',
        'graphic-h': '370px',
        'line-h': '1px',
        'line-w': '233px' 
      },
      boxShadow:{
        'custom':'0px 8px 16px rgba(16, 16, 35, 0.2)' 
      },
      gridTemplateRows:{
        '7' : 'repeat(7, minmax(0, 1fr))',
        
      }
    
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
