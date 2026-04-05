import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Placement from '../models/Placement';
import Internship from '../models/Internship';
import Document from '../models/Document';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedDummyData = async () => {
  if (!MONGODB_URI) {
    console.error('Cannot seed, no MONGODB_URI found.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Wiping existing non-admin data...');

    // Delete existing dummy students and associated data
    const nonAdminUsers = await User.find({ role: { $ne: 'admin' } });
    const nonAdminIds = nonAdminUsers.map(u => u._id);

    await User.deleteMany({ _id: { $in: nonAdminIds } });
    await Placement.deleteMany({ student: { $in: nonAdminIds } });
    await Internship.deleteMany({ student: { $in: nonAdminIds } });
    await Document.deleteMany({ student: { $in: nonAdminIds } });

    console.log('Generating dummy students...');
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    const studentsToCreate = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: defaultPassword,
        role: 'student',
        phone: '9876543210',
        department: 'Computer Science',
        year: '3rd Year',
        semester: '6th Semester',
        gender: 'Male',
        skills: [
          { category: 'Programming Languages', name: 'TypeScript', proficiency: 'Advanced' },
          { category: 'Databases', name: 'MongoDB', proficiency: 'Intermediate' }
        ],
        githubUrl: 'https://github.com/johndoe',
        linkedInUrl: 'https://linkedin.com/in/johndoe',
        about: 'Passionate full-stack developer looking for SDE roles.',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        username: 'janesmith',
        password: defaultPassword,
        role: 'student',
        phone: '9876543211',
        department: 'Information Technology',
        year: '4th Year',
        semester: '8th Semester',
        gender: 'Female',
        skills: [
          { category: 'Programming Languages', name: 'Python', proficiency: 'Advanced' },
          { category: 'Frameworks', name: 'Django', proficiency: 'Beginner' }
        ],
        githubUrl: 'https://github.com/janesmith',
        linkedInUrl: 'https://linkedin.com/in/janesmith',
        about: 'AI enthusiast with experience in developing predictive models.',
      },
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        username: 'alexj',
        password: defaultPassword,
        role: 'student',
        phone: '9876543212',
        department: 'Electronics',
        year: '4th Year',
        semester: '8th Semester',
        gender: 'Other',
        skills: [
          { category: 'Programming Languages', name: 'C++', proficiency: 'Advanced' }
        ],
        githubUrl: 'https://github.com/alexj',
        linkedInUrl: '',
        about: 'Hardware geek and IoT developer.',
      }
    ];

    const createdStudents = await User.insertMany(studentsToCreate);

    console.log('Generating placements & internships...');

    // Jane has a placement
    await Placement.create({
      student: createdStudents[1]._id,
      companyName: 'Google',
      role: 'Software Engineer',
      ctcOffered: 4500000,
      appliedDate: new Date('2025-10-15'),
      status: 'Selected'
    });

    // John has an internship
    await Internship.create({
      student: createdStudents[0]._id,
      companyName: 'Amazon',
      role: 'SDE Intern',
      duration: '6 Months',
      stipend: 100000,
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-07-10'),
      status: 'Ongoing'
    });

    // Alex has multiple things
    await Internship.create({
      student: createdStudents[2]._id,
      companyName: 'Intel',
      role: 'Hardware Intern',
      duration: '3 Months',
      stipend: 50000,
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-08-15'),
      status: 'Completed'
    });
    
    await Placement.create({
      student: createdStudents[2]._id,
      companyName: 'Qualcomm',
      role: 'Systems Engineer',
      ctcOffered: 2400000,
      appliedDate: new Date('2025-11-20'),
      status: 'Selected'
    });

    console.log('Generating dummy documents...');
    for (const student of createdStudents) {
      await Document.create([
        {
          student: student._id,
          name: `${student.name.split(' ')[0]}_Resume.pdf`,
          type: 'Resume',
          fileUrl: 'http://localhost:3000/uploads/dummy-resume.pdf',
          fileSize: 1048576,
          status: 'Approved'
        },
        {
          student: student._id,
          name: `10th_Marksheet.pdf`,
          type: 'Certificate',
          fileUrl: 'http://localhost:3000/uploads/dummy-marksheet.pdf',
          fileSize: 512000,
          status: 'Pending'
        }
      ]);
    }

    console.log('\n✅ Dummy data seeded successfully!');
    console.log('------------------------------');
    console.log('Created Users:');
    createdStudents.forEach(s => {
      console.log(`- Username: ${s.username} | Password: password123`);
    });
    console.log('------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDummyData();
