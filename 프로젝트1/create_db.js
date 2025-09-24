const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', 
  logging: false 
});


const Book = sequelize.define('Book', {
  
  title: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true 
  },
  pages: {
    type: DataTypes.INTEGER
  },
  publication_year: {
    type: DataTypes.INTEGER
  }
});

async function setupDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log("✅ 데이터베이스 테이블이 성공적으로 생성되었습니다.");
    const booksToInsert = [
      { title: '모던 자바스크립트 Deep Dive', author: '이웅모', isbn: '9791158392239', pages: 1080, publication_year: 2020 },
      { title: 'Clean Code(클린 코드)', author: '로버트 C. 마틴', isbn: '9788966260959', pages: 584, publication_year: 2013 },
      { title: 'HTTP 완벽 가이드', author: '데이빗 고울리', isbn: '9788966261208', pages: 840, publication_year: 2014 },
      { title: '운영체제(공룡책)', author: 'Abraham Silberschatz', isbn: '9791158390723', pages: 1120, publication_year: 2019 }
    ];

    await Book.bulkCreate(booksToInsert);
    console.log(`📚 책 정보 ${booksToInsert.length}건이 성공적으로 추가되었습니다.`);

  } catch (error) {
    console.error("❌ 데이터베이스 설정 중 오류가 발생했습니다:", error);
  } finally {
   
    await sequelize.close();
  }
}


setupDatabase();