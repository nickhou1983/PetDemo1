// 宠物配置页面 - JavaScript功能文件

// 宠物数据管理
class PetManager {
    constructor() {
        this.pets = this.loadPets();
        this.currentEditingPet = null;
        this.petToDelete = null;
        this.initializeEventListeners();
        this.renderPetsList();
    }

    // 从localStorage加载宠物数据
    loadPets() {
        const saved = localStorage.getItem('petPartyPets');
        return saved ? JSON.parse(saved) : [];
    }

    // 保存宠物数据到localStorage
    savePets() {
        localStorage.setItem('petPartyPets', JSON.stringify(this.pets));
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 添加宠物按钮
        const addPetBtn = document.getElementById('add-pet-btn');
        if (addPetBtn) {
            addPetBtn.addEventListener('click', () => this.openPetModal());
        }

        // 宠物表单提交
        const petForm = document.getElementById('pet-form');
        if (petForm) {
            petForm.addEventListener('submit', (e) => this.handlePetFormSubmit(e));
        }

        // 取消按钮
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closePetModal());
        }

        // 模态框关闭按钮
        const closeModals = document.querySelectorAll('.close-modal');
        closeModals.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // 点击模态框背景关闭
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // 照片上传
        this.setupPhotoUpload();

        // 删除确认相关
        this.setupDeleteConfirmation();

        // 表单实时验证
        this.setupFormValidation();
    }

    // 设置照片上传功能
    setupPhotoUpload() {
        const uploadArea = document.getElementById('photo-upload-area');
        const fileInput = document.getElementById('pet-photo');
        const photoPreview = document.getElementById('photo-preview');
        const uploadPlaceholder = document.getElementById('upload-placeholder');
        const removePhotoBtn = document.getElementById('remove-photo');

        if (!uploadArea || !fileInput) return;

        // 点击上传区域
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // 文件选择
        fileInput.addEventListener('change', (e) => {
            this.handlePhotoUpload(e.target.files[0]);
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handlePhotoUpload(file);
            }
        });

        // 移除照片
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removePhoto();
            });
        }
    }

    // 处理照片上传
    handlePhotoUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('pet-photo', '请选择有效的图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB限制
            this.showError('pet-photo', '图片文件大小不能超过5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const photoPreview = document.getElementById('photo-preview');
            const uploadPlaceholder = document.getElementById('upload-placeholder');
            const removePhotoBtn = document.getElementById('remove-photo');

            if (photoPreview && uploadPlaceholder) {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
                
                if (removePhotoBtn) {
                    removePhotoBtn.style.display = 'inline-block';
                }
            }
        };
        reader.readAsDataURL(file);
    }

    // 移除照片
    removePhoto() {
        const photoPreview = document.getElementById('photo-preview');
        const uploadPlaceholder = document.getElementById('upload-placeholder');
        const removePhotoBtn = document.getElementById('remove-photo');
        const fileInput = document.getElementById('pet-photo');

        if (photoPreview) photoPreview.style.display = 'none';
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'flex';
        if (removePhotoBtn) removePhotoBtn.style.display = 'none';
        if (fileInput) fileInput.value = '';
    }

    // 设置删除确认功能
    setupDeleteConfirmation() {
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        const confirmDeleteBtn = document.getElementById('confirm-delete');

        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                document.getElementById('delete-modal').style.display = 'none';
                this.petToDelete = null;
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (this.petToDelete) {
                    this.deletePet(this.petToDelete);
                }
            });
        }
    }

    // 设置表单验证
    setupFormValidation() {
        const requiredFields = ['pet-name', 'pet-type'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldId));
                field.addEventListener('input', () => this.clearFieldError(fieldId));
            }
        });
    }

    // 验证字段
    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'pet-name':
                if (!value) {
                    isValid = false;
                    errorMessage = '请输入宠物名称';
                } else if (value.length < 1 || value.length > 20) {
                    isValid = false;
                    errorMessage = '宠物名称长度应在1-20个字符之间';
                }
                break;
            case 'pet-type':
                if (!value) {
                    isValid = false;
                    errorMessage = '请选择宠物类型';
                }
                break;
        }

        if (!isValid) {
            this.showError(fieldId, errorMessage);
        } else {
            this.clearFieldError(fieldId);
        }

        return isValid;
    }

    // 显示字段错误
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field) {
            field.closest('.form-group').classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // 清除字段错误
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field) {
            field.closest('.form-group').classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // 打开宠物模态框
    openPetModal(pet = null) {
        const modal = document.getElementById('pet-modal');
        const modalTitle = document.getElementById('modal-title');
        const saveBtn = document.getElementById('save-pet-btn');

        if (!modal) return;

        this.currentEditingPet = pet;
        
        if (pet) {
            modalTitle.textContent = '编辑宠物信息';
            saveBtn.textContent = '保存更改';
            this.populateForm(pet);
        } else {
            modalTitle.textContent = '添加新宠物';
            saveBtn.textContent = '保存宠物信息';
            this.resetForm();
        }

        modal.style.display = 'block';
        
        // 聚焦到第一个输入框
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    // 关闭宠物模态框
    closePetModal() {
        const modal = document.getElementById('pet-modal');
        if (modal) {
            modal.style.display = 'none';
            this.currentEditingPet = null;
            this.resetForm();
        }
    }

    // 重置表单
    resetForm() {
        const form = document.getElementById('pet-form');
        if (form) {
            form.reset();
            
            // 清除所有错误状态
            const errorElements = form.querySelectorAll('.error-message');
            errorElements.forEach(el => el.classList.remove('show'));
            
            const errorGroups = form.querySelectorAll('.form-group.error');
            errorGroups.forEach(group => group.classList.remove('error'));
            
            // 重置照片预览
            this.removePhoto();
        }
    }

    // 填充表单数据
    populateForm(pet) {
        const fields = {
            'pet-name': pet.name,
            'pet-type': pet.type,
            'pet-breed': pet.breed || '',
            'pet-age': pet.age || '',
            'pet-gender': pet.gender || '',
            'pet-weight': pet.weight || '',
            'vaccination-status': pet.vaccinationStatus || '',
            'vaccination-notes': pet.vaccinationNotes || '',
            'special-needs': pet.specialNeeds || ''
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = value;
            }
        });

        // 显示宠物照片
        if (pet.photo) {
            const photoPreview = document.getElementById('photo-preview');
            const uploadPlaceholder = document.getElementById('upload-placeholder');
            const removePhotoBtn = document.getElementById('remove-photo');

            if (photoPreview) {
                photoPreview.src = pet.photo;
                photoPreview.style.display = 'block';
            }
            if (uploadPlaceholder) {
                uploadPlaceholder.style.display = 'none';
            }
            if (removePhotoBtn) {
                removePhotoBtn.style.display = 'inline-block';
            }
        }
    }

    // 处理表单提交
    handlePetFormSubmit(e) {
        e.preventDefault();

        // 验证必填字段
        const requiredFields = ['pet-name', 'pet-type'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            if (!this.validateField(fieldId)) {
                isValid = false;
            }
        });

        if (!isValid) {
            window.PetPartyApp?.showError?.('请填写所有必填字段');
            return;
        }

        // 收集表单数据
        const formData = this.collectFormData();
        
        if (this.currentEditingPet) {
            this.updatePet(this.currentEditingPet.id, formData);
        } else {
            this.addPet(formData);
        }

        this.closePetModal();
    }

    // 收集表单数据
    collectFormData() {
        const photoPreview = document.getElementById('photo-preview');
        
        return {
            name: document.getElementById('pet-name').value.trim(),
            type: document.getElementById('pet-type').value,
            breed: document.getElementById('pet-breed').value.trim(),
            age: document.getElementById('pet-age').value ? parseInt(document.getElementById('pet-age').value) : null,
            gender: document.getElementById('pet-gender').value,
            weight: document.getElementById('pet-weight').value ? parseFloat(document.getElementById('pet-weight').value) : null,
            photo: photoPreview && photoPreview.style.display !== 'none' ? photoPreview.src : null,
            vaccinationStatus: document.getElementById('vaccination-status').value,
            vaccinationNotes: document.getElementById('vaccination-notes').value.trim(),
            specialNeeds: document.getElementById('special-needs').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    // 添加宠物
    addPet(petData) {
        const newPet = {
            id: Date.now().toString(),
            ...petData
        };

        this.pets.push(newPet);
        this.savePets();
        this.renderPetsList();
        
        window.PetPartyApp?.showSuccess?.(`宠物 "${newPet.name}" 添加成功！`);
    }

    // 更新宠物
    updatePet(petId, petData) {
        const index = this.pets.findIndex(pet => pet.id === petId);
        if (index !== -1) {
            this.pets[index] = {
                ...this.pets[index],
                ...petData,
                updatedAt: new Date().toISOString()
            };
            this.savePets();
            this.renderPetsList();
            
            window.PetPartyApp?.showSuccess?.(`宠物 "${petData.name}" 信息更新成功！`);
        }
    }

    // 删除宠物
    deletePet(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (pet) {
            this.pets = this.pets.filter(p => p.id !== petId);
            this.savePets();
            this.renderPetsList();
            
            document.getElementById('delete-modal').style.display = 'none';
            this.petToDelete = null;
            
            window.PetPartyApp?.showSuccess?.(`宠物 "${pet.name}" 删除成功！`);
        }
    }

    // 显示删除确认
    showDeleteConfirmation(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (pet) {
            this.petToDelete = petId;
            
            const modal = document.getElementById('delete-modal');
            const petName = modal.querySelector('.delete-content p');
            
            if (petName) {
                petName.textContent = `确定要删除宠物 "${pet.name}" 的信息吗？此操作无法撤销。`;
            }
            
            modal.style.display = 'block';
        }
    }

    // 渲染宠物列表
    renderPetsList() {
        const petsList = document.getElementById('pets-list');
        const emptyState = document.getElementById('empty-state');

        if (!petsList || !emptyState) return;

        if (this.pets.length === 0) {
            petsList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            petsList.style.display = 'grid';
            emptyState.style.display = 'none';
            
            petsList.innerHTML = this.pets.map(pet => this.createPetCard(pet)).join('');
            
            // 添加事件监听器
            this.attachPetCardListeners();
        }
    }

    // 创建宠物卡片HTML
    createPetCard(pet) {
        const petTypeLabels = {
            dog: '狗',
            cat: '猫',
            bird: '鸟',
            rabbit: '兔子',
            hamster: '仓鼠',
            fish: '鱼',
            other: '其他'
        };

        const genderLabels = {
            male: '公',
            female: '母'
        };

        const vaccinationLabels = {
            'up-to-date': '疫苗齐全',
            'partial': '部分接种',
            'overdue': '疫苗过期',
            'unknown': '不清楚'
        };

        const vaccinationIcons = {
            'up-to-date': 'fas fa-check',
            'partial': 'fas fa-exclamation',
            'overdue': 'fas fa-times',
            'unknown': 'fas fa-question'
        };

        return `
            <div class="pet-card" data-pet-id="${pet.id}">
                <div class="pet-header">
                    ${pet.photo ? 
                        `<img src="${pet.photo}" alt="${pet.name}" class="pet-photo">` :
                        `<div class="pet-photo-placeholder"><i class="fas fa-paw"></i></div>`
                    }
                    <div class="pet-basic-info">
                        <h3>${pet.name}</h3>
                        <span class="pet-type">${petTypeLabels[pet.type] || pet.type}</span>
                    </div>
                </div>
                
                <div class="pet-details">
                    ${pet.breed ? `
                        <div class="pet-detail-row">
                            <span class="pet-detail-label">品种:</span>
                            <span class="pet-detail-value">${pet.breed}</span>
                        </div>
                    ` : ''}
                    ${pet.age ? `
                        <div class="pet-detail-row">
                            <span class="pet-detail-label">年龄:</span>
                            <span class="pet-detail-value">${pet.age}岁</span>
                        </div>
                    ` : ''}
                    ${pet.gender ? `
                        <div class="pet-detail-row">
                            <span class="pet-detail-label">性别:</span>
                            <span class="pet-detail-value">${genderLabels[pet.gender] || pet.gender}</span>
                        </div>
                    ` : ''}
                    ${pet.weight ? `
                        <div class="pet-detail-row">
                            <span class="pet-detail-label">体重:</span>
                            <span class="pet-detail-value">${pet.weight}kg</span>
                        </div>
                    ` : ''}
                </div>

                ${pet.vaccinationStatus ? `
                    <div class="vaccination-status">
                        <div class="vaccination-icon ${pet.vaccinationStatus}">
                            <i class="${vaccinationIcons[pet.vaccinationStatus] || 'fas fa-question'}"></i>
                        </div>
                        <span>${vaccinationLabels[pet.vaccinationStatus] || pet.vaccinationStatus}</span>
                    </div>
                ` : ''}

                ${pet.specialNeeds ? `
                    <div class="pet-detail-row">
                        <span class="pet-detail-label">特殊需求:</span>
                        <span class="pet-detail-value">${pet.specialNeeds}</span>
                    </div>
                ` : ''}

                <div class="pet-actions-buttons">
                    <button class="btn btn-secondary btn-small edit-pet-btn" data-pet-id="${pet.id}">
                        <i class="fas fa-edit"></i>
                        编辑
                    </button>
                    <button class="btn btn-danger btn-small delete-pet-btn" data-pet-id="${pet.id}">
                        <i class="fas fa-trash"></i>
                        删除
                    </button>
                </div>
            </div>
        `;
    }

    // 附加宠物卡片事件监听器
    attachPetCardListeners() {
        // 编辑按钮
        const editBtns = document.querySelectorAll('.edit-pet-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = e.target.closest('.edit-pet-btn').dataset.petId;
                const pet = this.pets.find(p => p.id === petId);
                if (pet) {
                    this.openPetModal(pet);
                }
            });
        });

        // 删除按钮
        const deleteBtns = document.querySelectorAll('.delete-pet-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = e.target.closest('.delete-pet-btn').dataset.petId;
                this.showDeleteConfirmation(petId);
            });
        });
    }

    // 获取宠物统计信息
    getStatistics() {
        const stats = {
            total: this.pets.length,
            byType: {},
            byVaccination: {},
            averageAge: 0
        };

        this.pets.forEach(pet => {
            // 按类型统计
            stats.byType[pet.type] = (stats.byType[pet.type] || 0) + 1;
            
            // 按疫苗状态统计
            if (pet.vaccinationStatus) {
                stats.byVaccination[pet.vaccinationStatus] = (stats.byVaccination[pet.vaccinationStatus] || 0) + 1;
            }
        });

        // 计算平均年龄
        const agesSum = this.pets.reduce((sum, pet) => sum + (pet.age || 0), 0);
        const petsWithAge = this.pets.filter(pet => pet.age).length;
        stats.averageAge = petsWithAge > 0 ? (agesSum / petsWithAge).toFixed(1) : 0;

        return stats;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保主应用已初始化
    if (typeof initializeApp === 'function') {
        initializeApp();
    }
    
    // 初始化宠物管理器
    window.petManager = new PetManager();
    
    // 输出统计信息到控制台（用于调试）
    console.log('宠物配置页面已加载');
    console.log('宠物统计:', window.petManager.getStatistics());
});

// 导出宠物管理器（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PetManager;
}