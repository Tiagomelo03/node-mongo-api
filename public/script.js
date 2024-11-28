/**
 * @file script.js
 * @description This file contains the JavaScript code for handling the frontend logic of the web application.
 * @version 1.0.0
 * @date 2024-11-20
 * @author Pedro Moreira
 * @organization ESTG-IPVC
 */

// using DOMContentLoaded
// alternatively "defer" attribute could be used in the <script> element 
// to prevent running the script before the page is loaded.
document.addEventListener('DOMContentLoaded', () => {
    const studentTable = document.getElementById('itemsTable');
    const studentForm = document.getElementById('student-form');
    const studentNameInput = document.getElementById('student-name');
    const studentAgeInput = document.getElementById('student-age');
    const studentStudyInput = document.getElementById('student-study');
    const submitButton = document.getElementById('submit-button');

    const apiUrl = 'http://localhost:3000/students';

    // Fetch and display students
    // TODO: This can be improved to avoid calling the updateStudent 
    // if even after after editing a field it has not been updated

    const fetchStudents = async () => {
        const response = await fetch(apiUrl);
        const students = await response.json();
        const tbody = studentTable.querySelector('tbody');
        tbody.innerHTML = '';
        students.forEach(student => {

            // <element>.dataset property is used to store information
            // TODO :: the cells from column id could be a hidden
            const tr = document.createElement('tr');
            tr.dataset.id = student._id;

            const idTd = document.createElement('td');
            idTd.textContent = student._id;

            const nameTd = document.createElement('td');
            nameTd.contentEditable = true;
            nameTd.textContent = student.name;
            nameTd.addEventListener('blur', () => updateStudent(student._id, nameTd.textContent, ageTd.textContent, studyTd.textContent));

            const ageTd = document.createElement('td');
            ageTd.contentEditable = true;
            ageTd.textContent = student.age;
            ageTd.addEventListener('blur', () => updateStudent(student._id, nameTd.textContent, ageTd.textContent, studyTd.textContent));

            const studyTd = document.createElement('td');
            studyTd.contentEditable = true;
            studyTd.textContent = student.study;
            studyTd.addEventListener('blur', () => updateStudent(student._id, nameTd.textContent, ageTd.textContent, studyTd.textContent));

            const actionsTd = document.createElement('td');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteStudent(student._id));

            actionsTd.appendChild(deleteButton);

            tr.appendChild(idTd);
            tr.appendChild(nameTd);
            tr.appendChild(ageTd);
            tr.appendChild(studyTd);
            tr.appendChild(actionsTd);

            tbody.appendChild(tr);
        });
    };

    // Add new student
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = studentNameInput.value;
        const age = studentAgeInput.value;
        const study = studentStudyInput.value;

        const student = { name, age, study };

        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        studentForm.reset();
        fetchStudents();
    });

    // Update (save) student
    const updateStudent = async (id, name, age, study) => {
        const student = { name, age, study };

        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        fetchStudents();
    };

    // Delete student
    const deleteStudent = async (id) => {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        fetchStudents();
    };

    fetchStudents();
});
