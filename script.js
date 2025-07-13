
        // Authentication and user management
        let currentUser = null;
        let users = {
            'admin': { password: 'admin123', role: 'admin' },
            'owner': { password: 'owner123', role: 'owner' }
        };

        // Sample job data with admin tracking
        let jobs = [
            {
                id: 1,
                title: "Frontend Developer",
                company: "TechCorp Solutions",
                location: "Mumbai",
                salary: "₹6-10 LPA",
                description: "We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for creating amazing user experiences using modern web technologies.",
                requirements: "3+ years experience with React, JavaScript, HTML/CSS. Knowledge of responsive design and modern development tools.",
                postedBy: "admin",
                postedDate: new Date().toLocaleDateString()
            },
            {
                id: 2,
                title: "Digital Marketing Manager",
                company: "Growth Marketing Inc",
                location: "Delhi",
                salary: "₹8-12 LPA",
                description: "Lead our digital marketing initiatives and drive growth through innovative campaigns across multiple channels.",
                requirements: "5+ years in digital marketing, experience with Google Ads, Facebook Ads, SEO/SEM, and analytics tools.",
                postedBy: "admin",
                postedDate: new Date().toLocaleDateString()
            },
            {
                id: 3,
                title: "Data Analyst",
                company: "DataInsights Ltd",
                location: "Bangalore",
                salary: "₹5-8 LPA",
                description: "Analyze complex datasets to provide actionable insights that drive business decisions and strategy.",
                requirements: "Strong skills in SQL, Python/R, Excel. Experience with data visualization tools like Tableau or Power BI.",
                postedBy: "owner",
                postedDate: new Date().toLocaleDateString()
            }
        ];

        // Authentication functions
        function showLoginModal() {
            document.getElementById('login-modal').classList.remove('hidden');
        }

        function closeLoginModal() {
            document.getElementById('login-modal').classList.add('hidden');
            document.getElementById('login-form').reset();
        }

        function login(username, password) {
            if (users[username] && users[username].password === password) {
                currentUser = { username, role: users[username].role };
                updateUIForLoggedInUser();
                closeLoginModal();
                showSection('admin');
                return true;
            }
            return false;
        }

        function logout() {
            currentUser = null;
            updateUIForLoggedInUser();
            showSection('jobs');
        }

        function updateUIForLoggedInUser() {
            const userInfo = document.getElementById('user-info');
            const welcomeText = document.getElementById('welcome-text');
            const ownerControls = document.getElementById('owner-controls');
            
            if (currentUser) {
                userInfo.classList.remove('hidden');
                welcomeText.textContent = `Welcome, ${currentUser.username} (${currentUser.role})`;
                
                if (currentUser.role === 'owner') {
                    ownerControls.classList.remove('hidden');
                } else {
                    ownerControls.classList.add('hidden');
                }
            } else {
                userInfo.classList.add('hidden');
                ownerControls.classList.add('hidden');
            }
        }

        // Show/hide sections
        function showSection(section) {
            document.getElementById('jobs-section').classList.toggle('hidden', section !== 'jobs');
            document.getElementById('admin-section').classList.toggle('hidden', section !== 'admin');
            
            if (section === 'jobs') {
                displayJobs(jobs);
            } else if (section === 'admin' && currentUser) {
                showAdminTab('add-job');
            }
        }

        // Admin tab management
        function showAdminTab(tab) {
            // Hide all tabs
            document.getElementById('add-job-tab').classList.add('hidden');
            document.getElementById('manage-jobs-tab').classList.add('hidden');
            document.getElementById('manage-admins-tab').classList.add('hidden');
            document.getElementById('job-stats-tab').classList.add('hidden');
            
            // Show selected tab
            document.getElementById(tab + '-tab').classList.remove('hidden');
            
            // Load tab content
            if (tab === 'manage-jobs') {
                loadJobManagement();
            } else if (tab === 'manage-admins') {
                loadAdminManagement();
            } else if (tab === 'job-stats') {
                loadJobStatistics();
            }
        }

        // Job management functions
        function loadJobManagement() {
            const container = document.getElementById('admin-job-list');
            container.innerHTML = '';
            
            jobs.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-management-card';
                jobCard.innerHTML = `
                    <div class="job-management-info">
                        <h3>${job.title}</h3>
                        <p class="company">${job.company}</p>
                        <p class="details">📍 ${job.location} | 💰 ${job.salary}</p>
                        <p class="posted-by">Posted by: ${job.postedBy} on ${job.postedDate}</p>
                    </div>
                    <div class="job-management-actions">
                        <button onclick="editJob(${job.id})" class="btn primary">
                            Edit
                        </button>
                        <button onclick="deleteJob(${job.id})" class="btn danger">
                            Delete
                        </button>
                    </div>
                `;
                container.appendChild(jobCard);
            });
        }

        function editJob(jobId) {
            const job = jobs.find(j => j.id === jobId);
            if (!job) return;
            
            document.getElementById('edit-job-id').value = job.id;
            document.getElementById('edit-job-title').value = job.title;
            document.getElementById('edit-company-name').value = job.company;
            document.getElementById('edit-job-location').value = job.location;
            document.getElementById('edit-salary-range').value = job.salary;
            document.getElementById('edit-job-description').value = job.description;
            document.getElementById('edit-job-requirements').value = job.requirements;
            
            document.getElementById('edit-job-modal').classList.remove('hidden');
        }

        function closeEditModal() {
            document.getElementById('edit-job-modal').classList.add('hidden');
        }

        function deleteJob(jobId) {
            if (confirm('Are you sure you want to delete this job?')) {
                jobs = jobs.filter(job => job.id !== jobId);
                updateLocationFilter();
                loadJobManagement();
                alert('Job deleted successfully!');
            }
        }

        // Admin management functions (Owner only)
        function loadAdminManagement() {
            const container = document.getElementById('admin-list');
            container.innerHTML = '';
            
            Object.keys(users).forEach(username => {
                if (users[username].role === 'admin') {
                    const adminCard = document.createElement('div');
                    adminCard.className = 'admin-card';
                    adminCard.innerHTML = `
                        <div class="admin-info">
                            <h4>${username}</h4>
                            <p>Role: Admin</p>
                        </div>
                        <div class="admin-actions">
                            <button onclick="changeAdminPassword('${username}')" class="btn primary">
                                Change Password
                            </button>
                            <button onclick="removeAdmin('${username}')" class="btn danger">
                                Remove
                            </button>
                        </div>
                    `;
                    container.appendChild(adminCard);
                }
            });
        }

        function addAdmin(username, password) {
            if (users[username]) {
                alert('Username already exists!');
                return false;
            }
            
            users[username] = { password, role: 'admin' };
            loadAdminManagement();
            alert('Admin added successfully!');
            return true;
        }

        function removeAdmin(username) {
            if (confirm(`Are you sure you want to remove admin "${username}"?`)) {
                delete users[username];
                loadAdminManagement();
                alert('Admin removed successfully!');
            }
        }

        function changeAdminPassword(username) {
            const newPassword = prompt(`Enter new password for ${username}:`);
            if (newPassword && newPassword.length >= 6) {
                users[username].password = newPassword;
                alert('Password changed successfully!');
            } else if (newPassword) {
                alert('Password must be at least 6 characters long!');
            }
        }

        // Job statistics (Owner only)
        function loadJobStatistics() {
            const container = document.getElementById('job-statistics');
            
            // Calculate statistics
            const totalJobs = jobs.length;
            const adminStats = {};
            
            jobs.forEach(job => {
                if (!adminStats[job.postedBy]) {
                    adminStats[job.postedBy] = 0;
                }
                adminStats[job.postedBy]++;
            });
            
            const totalAdmins = Object.keys(users).filter(u => users[u].role === 'admin').length;
            
            container.innerHTML = `
                <div class="stat-card blue">
                    <h3>${totalJobs}</h3>
                    <p>Total Jobs</p>
                </div>
                <div class="stat-card green">
                    <h3>${totalAdmins}</h3>
                    <p>Total Admins</p>
                </div>
                <div class="jobs-by-admin">
                    <h3>Jobs by Admin</h3>
                    ${Object.keys(adminStats).map(admin => 
                        `<div class="admin-job-stat">
                            <span>${admin}</span>
                            <span>${adminStats[admin]} jobs</span>
                        </div>`
                    ).join('')}
                </div>
            `;
        }

        // Display jobs
        function displayJobs(jobsToShow) {
            const container = document.getElementById('job-listings');
            container.innerHTML = '';
            
            jobsToShow.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card fade-in';
                jobCard.innerHTML = `
                    <div class="job-header">
                        <div>
                            <h3 class="job-title">${job.title}</h3>
                            <p class="job-company">${job.company}</p>
                        </div>
                        <span class="job-salary">${job.salary}</span>
                    </div>
                    <div class="job-location">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        ${job.location}
                    </div>
                    <p class="job-description">${job.description}</p>
                    <div class="job-actions">
                        <button onclick="viewJob(${job.id})" class="view-details">
                            View Details
                        </button>
                        <button onclick="applyForJob(${job.id})" class="apply-btn">
                            Apply Now
                        </button>
                    </div>
                `;
                container.appendChild(jobCard);
            });
        }

        // Update location filter with all unique locations
        function updateLocationFilter() {
            const locationSelect = document.getElementById('location-filter');
            const currentValue = locationSelect.value;
            
            // Get unique locations from all jobs
            const uniqueLocations = [...new Set(jobs.map(job => job.location))].sort();
            
            // Clear existing options except "All Locations"
            locationSelect.innerHTML = '<option value="">All Locations</option>';
            
            // Add all unique locations
            uniqueLocations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
            
            // Restore previous selection if it still exists
            if (currentValue && uniqueLocations.includes(currentValue)) {
                locationSelect.value = currentValue;
            }
        }

        // Search jobs
        function searchJobs() {
            const searchTerm = document.getElementById('job-search').value.toLowerCase();
            const locationFilter = document.getElementById('location-filter').value;
            
            const filteredJobs = jobs.filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                                    job.company.toLowerCase().includes(searchTerm) ||
                                    job.description.toLowerCase().includes(searchTerm);
                const matchesLocation = !locationFilter || job.location === locationFilter;
                return matchesSearch && matchesLocation;
            });
            
            displayJobs(filteredJobs);
        }

        // View job details
        function viewJob(jobId) {
            const job = jobs.find(j => j.id === jobId);
            if (job) {
                alert(`Job Details:\n\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements}`);
            }
        }

        // Apply for job
        function applyForJob(jobId) {
            const job = jobs.find(j => j.id === jobId);
            document.getElementById('job-details').innerHTML = `
                <h4>${job.title}</h4>
                <p class="company">${job.company}</p>
                <p class="details">📍 ${job.location} | 💰 ${job.salary}</p>
            `;
            document.getElementById('application-modal').classList.remove('hidden');
        }

        // Close modal
        function closeModal() {
            document.getElementById('application-modal').classList.add('hidden');
            document.getElementById('application-form').reset();
        }

        // Close success modal
        function closeSuccessModal() {
            document.getElementById('success-modal').classList.add('hidden');
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Login form
            document.getElementById('login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                
                if (login(username, password)) {
                    alert('Login successful!');
                } else {
                    alert('Invalid username or password!');
                }
            });

            // Job form
            document.getElementById('job-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newJob = {
                    id: jobs.length + 1,
                    title: document.getElementById('job-title').value,
                    company: document.getElementById('company-name').value,
                    location: document.getElementById('job-location').value,
                    salary: document.getElementById('salary-range').value,
                    description: document.getElementById('job-description').value,
                    requirements: document.getElementById('job-requirements').value,
                    postedBy: currentUser.username,
                    postedDate: new Date().toLocaleDateString()
                };
                
                jobs.push(newJob);
                updateLocationFilter();
                this.reset();
                alert('Job posted successfully! 🎉');
            });

            // Edit job form
            document.getElementById('edit-job-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const jobId = parseInt(document.getElementById('edit-job-id').value);
                const jobIndex = jobs.findIndex(j => j.id === jobId);
                
                if (jobIndex !== -1) {
                    jobs[jobIndex] = {
                        ...jobs[jobIndex],
                        title: document.getElementById('edit-job-title').value,
                        company: document.getElementById('edit-company-name').value,
                        location: document.getElementById('edit-job-location').value,
                        salary: document.getElementById('edit-salary-range').value,
                        description: document.getElementById('edit-job-description').value,
                        requirements: document.getElementById('edit-job-requirements').value
                    };
                    
                    updateLocationFilter();
                    closeEditModal();
                    loadJobManagement();
                    alert('Job updated successfully!');
                }
            });

            // Add admin form
            document.getElementById('add-admin-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('new-admin-username').value;
                const password = document.getElementById('new-admin-password').value;
                
                if (addAdmin(username, password)) {
                    this.reset();
                }
            });

            // Application form
            document.getElementById('application-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('applicant-name').value,
                    mobile: document.getElementById('applicant-mobile').value,
                    email: document.getElementById('applicant-email').value,
                    aadhaar: document.getElementById('aadhaar-file').files[0]?.name || 'Not uploaded',
                    pan: document.getElementById('pan-file').files[0]?.name || 'Not uploaded',
                    marksheet: document.getElementById('marksheet-file').files[0]?.name || 'Not uploaded',
                    resume: document.getElementById('resume-file').files[0]?.name || 'Not uploaded',
                    coverLetter: document.getElementById('cover-letter').value
                };
                
                console.log('Application Data:', formData);
                
                closeModal();
                document.getElementById('success-modal').classList.remove('hidden');
            });

            // Search functionality
            document.getElementById('job-search').addEventListener('input', searchJobs);
            document.getElementById('location-filter').addEventListener('change', searchJobs);

            // Initialize page
            updateLocationFilter();
            showSection('jobs');
        });
   
