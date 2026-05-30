document.addEventListener('DOMContentLoaded', () => {
    // ตรวจสอบว่าผู้ใช้กำลังอยู่ในหน้า Quiz หรือไม่
    const quizContent = document.getElementById('quiz-content');
    
    if (quizContent) {
        // ดึง Quiz ID จาก URL (เช่น /quiz/g7_ch1_q1)
        const pathParts = window.location.pathname.split('/');
        const quizId = pathParts[pathParts.length - 1];

        if (quizId) {
            fetchQuizData(quizId);
        }
    }
});

// ฟังก์ชันดึงข้อมูล JSON จาก Python Backend
async function fetchQuizData(quizId) {
    try {
        const response = await fetch(`/api/quiz_data/${quizId}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        renderQuiz(data);
        
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        document.getElementById('quiz-title').innerText = 'Error loading quiz.';
        document.getElementById('quiz-content').innerHTML = 
            '<p>Could not load the quiz data. Please try again later.</p>';
    }
}

// ฟังก์ชันสำหรับนำข้อมูลที่ได้มาสร้างเป็น HTML 
function renderQuiz(data) {
    const quizTitle = document.getElementById('quiz-title');
    const quizContent = document.getElementById('quiz-content');

    // อัปเดตหัวข้อ Quiz
    quizTitle.innerText = data.title || 'Practice Quiz';

    // ตรวจสอบว่ามีคำถามส่งมาหรือไม่ (เตรียมไว้สำหรับตอนทำ Backend เต็มรูปแบบ)
    if (data.questions && data.questions.length > 0) {
        let htmlContent = '';
        
        // วนลูปสร้าง HTML สำหรับแต่ละคำถาม
        data.questions.forEach((question, index) => {
            htmlContent += `
                <div class="question-block" style="margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 10px;">
                    <p><strong>Question ${index + 1}:</strong> ${question.text}</p>
                    </div>
            `;
        });
        
        quizContent.innerHTML = htmlContent;
    } else {
        // กรณีที่ Backend ยังส่งมาแค่ Mock Data เปล่าๆ
        quizContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>Ready to load questions for <strong>${data.quiz_id}</strong></p>
                <p style="color: #666; font-size: 0.9em;">(Questions will appear here once added to the backend)</p>
            </div>
        `;
    }
}

// ฟังก์ชันสำหรับจัดการการสลับ Tab
function openYear(evt, gradeId) {
    // 1. ซ่อนเนื้อหาของทุกๆ ชั้นปี
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // 2. เอาสถานะ 'active' ออกจากปุ่ม Tab ทุกปุ่ม
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. แสดงเนื้อหาของชั้นปีที่ถูกคลิก และไฮไลต์ปุ่มนั้น
    document.getElementById(gradeId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// ... (โค้ดเดิมส่วนของ Quiz ให้คงไว้ด้านล่างนี้) ...


// ฟังก์ชันสำหรับเปิด Chapter ภายใน Grade นั้นๆ
function openChapter(chapterId, gradeId) {
    // 1. ระบุ container ของ Grade ที่กำลังใช้งานอยู่
    const gradeContainer = document.getElementById(gradeId);
    
    // 2. ซ่อนเนื้อหา Chapter ทั้งหมดใน Grade นี้
    const allChapters = gradeContainer.querySelectorAll('.chapter-content');
    allChapters.forEach(ch => ch.classList.remove('active'));
    
    // 3. เอาสถานะ active ออกจากปุ่มเมนู Chapter ทั้งหมดใน Grade นี้
    const allChBtns = gradeContainer.querySelectorAll('.ch-btn');
    allChBtns.forEach(btn => btn.classList.remove('active'));
    
    // 4. แสดง Chapter ที่ถูกเรียก
    const targetChapter = document.getElementById(chapterId);
    if (targetChapter) {
        targetChapter.classList.add('active');
    }
    
    // 5. ไฮไลต์ปุ่มเมนู Chapter ให้ตรงกับหน้าที่กำลังแสดงอยู่
    // โดยค้นหาปุ่มที่มี onclick ตรงกับ chapterId
    const targetBtn = gradeContainer.querySelector(`.ch-btn[onclick*="${chapterId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}