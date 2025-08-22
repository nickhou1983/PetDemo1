// 宠物配置页面JavaScript功能

// 宠物数据管理
class PetManager {
    constructor() {
        this.pets = this.loadPets();
        this.currentEditingPet = null;
        this.init();
    }

    // 初始化
    init() {
        this.bindEvents();
        this.renderPetList();
    }

    // 绑定事件
    bindEvents() {
        // 添加宠物按钮
        const addPetBtn = document.querySelector('.add-pet-btn');
        if (addPetBtn) {
            addPetBtn.addEventListener('click', () => this.showAddForm());
        }

        // 关闭表单按钮
        const closeFormBtn = document.getElementById('close-form');
        if (closeFormBtn) {
            closeFormBtn.addEventListener('click', () => this.hideForm());
        }

        // 取消按钮
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideForm());
        }

        // 表单提交
        const petForm = document.getElementById('pet-form');
        if (petForm) {
            petForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // 照片上传
        const uploadBtn = document.getElementById('upload-photo-btn');
        const photoInput = document.getElementById('pet-photo');
        const photoPreview = document.getElementById('photo-preview');
        
        if (uploadBtn && photoInput) {
            uploadBtn.addEventListener('click', () => photoInput.click());
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
            photoPreview.addEventListener('click', () => photoInput.click());
        }

        // 删除确认模态框
        const deleteModal = document.getElementById('delete-modal');
        const cancelDeleteBtn = deleteModal?.querySelector('.cancel-delete-btn');
        const confirmDeleteBtn = deleteModal?.querySelector('.confirm-delete-btn');
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        }
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }

        // 表单实时验证
        this.setupFormValidation();
    }

    // 设置表单验证
    setupFormValidation() {
        const petName = document.getElementById('pet-name');
        const petType = document.getElementById('pet-type');
        const petAge = document.getElementById('pet-age');
        const petWeight = document.getElementById('pet-weight');

        if (petName) {
            petName.addEventListener('blur', () => this.validatePetName());
            petName.addEventListener('input', () => this.clearError('pet-name'));
        }

        if (petType) {
            petType.addEventListener('change', () => this.validatePetType());
        }

        if (petAge) {
            petAge.addEventListener('blur', () => this.validatePetAge());
            petAge.addEventListener('input', () => this.clearError('pet-age'));
        }

        if (petWeight) {
            petWeight.addEventListener('blur', () => this.validatePetWeight());
            petWeight.addEventListener('input', () => this.clearError('pet-weight'));
        }
    }

    // 验证宠物名称
    validatePetName() {
        const petName = document.getElementById('pet-name');
        const value = petName.value.trim();
        
        if (!value) {
            this.showError('pet-name', '请输入宠物名称');
            return false;
        }
        
        if (value.length < 1 || value.length > 20) {
            this.showError('pet-name', '宠物名称长度应在1-20个字符之间');
            return false;
        }
        
        this.clearError('pet-name');
        return true;
    }

    // 验证宠物类型
    validatePetType() {
        const petType = document.getElementById('pet-type');
        const value = petType.value;
        
        if (!value) {
            this.showError('pet-type', '请选择宠物类型');
            return false;
        }
        
        this.clearError('pet-type');
        return true;
    }

    // 验证宠物年龄
    validatePetAge() {
        const petAge = document.getElementById('pet-age');
        const value = petAge.value;
        
        if (value && (value < 0 || value > 30)) {
            this.showError('pet-age', '年龄应在0-30岁之间');
            return false;
        }
        
        this.clearError('pet-age');
        return true;
    }

    // 验证宠物体重
    validatePetWeight() {
        const petWeight = document.getElementById('pet-weight');
        const value = petWeight.value;
        
        if (value && (value < 0 || value > 100)) {
            this.showError('pet-weight', '体重应在0-100kg之间');
            return false;
        }
        
        this.clearError('pet-weight');
        return true;
    }

    // 显示错误信息
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // 清除错误信息
    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        if (field) {
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // 显示添加表单
    showAddForm() {
        this.currentEditingPet = null;
        this.resetForm();
        document.getElementById('form-title').textContent = '添加新宠物';
        document.querySelector('.pet-form-container').classList.add('active');
    }

    // 显示编辑表单
    showEditForm(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return;

        this.currentEditingPet = pet;
        this.populateForm(pet);
        document.getElementById('form-title').textContent = '编辑宠物信息';
        document.querySelector('.pet-form-container').classList.add('active');
    }

    // 隐藏表单
    hideForm() {
        document.querySelector('.pet-form-container').classList.remove('active');
        this.resetForm();
        this.currentEditingPet = null;
    }

    // 重置表单
    resetForm() {
        const form = document.getElementById('pet-form');
        if (form) {
            form.reset();
        }
        
        // 重置照片预览
        const photoPreview = document.getElementById('photo-preview');
        if (photoPreview) {
            photoPreview.innerHTML = `
                <div class="photo-placeholder">
                    <i class="fas fa-camera"></i>
                    <p>点击上传照片</p>
                </div>
            `;
        }
        
        // 清除所有错误
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.classList.remove('show'));
        
        const errorFields = document.querySelectorAll('.form-group input.error, .form-group select.error');
        errorFields.forEach(el => el.classList.remove('error'));
    }

    // 填充表单数据
    populateForm(pet) {
        document.getElementById('pet-name').value = pet.name || '';
        document.getElementById('pet-type').value = pet.type || '';
        document.getElementById('pet-breed').value = pet.breed || '';
        document.getElementById('pet-age').value = pet.age || '';
        document.getElementById('pet-gender').value = pet.gender || '';
        document.getElementById('pet-weight').value = pet.weight || '';
        document.getElementById('pet-vaccination').value = pet.vaccination || '';
        document.getElementById('pet-notes').value = pet.notes || '';

        // 设置照片预览
        const photoPreview = document.getElementById('photo-preview');
        if (pet.photo && photoPreview) {
            photoPreview.innerHTML = `<img src="${pet.photo}" alt="宠物照片">`;
        }
    }

    // 处理表单提交
    handleFormSubmit(e) {
        e.preventDefault();

        // 验证表单
        const isNameValid = this.validatePetName();
        const isTypeValid = this.validatePetType();
        const isAgeValid = this.validatePetAge();
        const isWeightValid = this.validatePetWeight();

        if (!isNameValid || !isTypeValid || !isAgeValid || !isWeightValid) {
            this.showNotification('请检查并修正表单中的错误', 'error');
            return;
        }

        // 收集表单数据
        const formData = new FormData(e.target);
        const petData = {
            id: this.currentEditingPet ? this.currentEditingPet.id : this.generateId(),
            name: formData.get('petName').trim(),
            type: formData.get('petType'),
            breed: formData.get('petBreed').trim(),
            age: formData.get('petAge') ? parseInt(formData.get('petAge')) : null,
            gender: formData.get('petGender'),
            weight: formData.get('petWeight') ? parseFloat(formData.get('petWeight')) : null,
            vaccination: formData.get('petVaccination').trim(),
            notes: formData.get('petNotes').trim(),
            photo: this.getCurrentPhoto(),
            createdAt: this.currentEditingPet ? this.currentEditingPet.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 保存数据
        if (this.currentEditingPet) {
            this.updatePet(petData);
            this.showNotification('宠物信息更新成功！', 'success');
        } else {
            this.addPet(petData);
            this.showNotification('宠物添加成功！', 'success');
        }

        this.hideForm();
        this.renderPetList();
    }

    // 获取当前照片
    getCurrentPhoto() {
        const photoPreview = document.getElementById('photo-preview');
        const img = photoPreview?.querySelector('img');
        return img ? img.src : null;
    }

    // 处理照片上传
    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            this.showNotification('请选择有效的图片文件', 'error');
            return;
        }

        // 验证文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('图片文件大小不能超过5MB', 'error');
            return;
        }

        // 读取文件并显示预览
        const reader = new FileReader();
        reader.onload = (e) => {
            const photoPreview = document.getElementById('photo-preview');
            if (photoPreview) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="宠物照片">`;
            }
        };
        reader.readAsDataURL(file);
    }

    // 生成唯一ID
    generateId() {
        return 'pet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 添加宠物
    addPet(petData) {
        this.pets.push(petData);
        this.savePets();
    }

    // 更新宠物
    updatePet(petData) {
        const index = this.pets.findIndex(p => p.id === petData.id);
        if (index !== -1) {
            this.pets[index] = petData;
            this.savePets();
        }
    }

    // 删除宠物
    deletePet(petId) {
        this.petToDelete = petId;
        this.showDeleteModal();
    }

    // 显示删除确认模态框
    showDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // 隐藏删除确认模态框
    hideDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.petToDelete = null;
    }

    // 确认删除
    confirmDelete() {
        if (this.petToDelete) {
            this.pets = this.pets.filter(p => p.id !== this.petToDelete);
            this.savePets();
            this.renderPetList();
            this.showNotification('宠物信息已删除', 'success');
        }
        this.hideDeleteModal();
    }

    // 渲染宠物列表
    renderPetList() {
        const petList = document.getElementById('pet-list');
        if (!petList) return;

        if (this.pets.length === 0) {
            petList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-paw"></i>
                    <h3>还没有添加宠物</h3>
                    <p>点击"添加宠物"按钮开始添加您的毛孩子信息</p>
                </div>
            `;
            return;
        }

        petList.innerHTML = this.pets.map(pet => this.createPetCard(pet)).join('');
    }

    // 创建宠物卡片
    createPetCard(pet) {
        const typeLabels = {
            'dog': '狗',
            'cat': '猫',
            'other': '其他'
        };

        const genderLabels = {
            'male': '雄性',
            'female': '雌性'
        };

        return `
            <div class="pet-card" data-pet-id="${pet.id}">
                <div class="pet-card-header">
                    <div class="pet-info">
                        <h3>${pet.name}</h3>
                        <span class="pet-type">${typeLabels[pet.type] || pet.type}</span>
                    </div>
                    <div class="pet-photo-container">
                        ${pet.photo ? 
                            `<img src="${pet.photo}" alt="${pet.name}" class="pet-photo">` :
                            `<div class="pet-photo-placeholder"><i class="fas fa-paw"></i></div>`
                        }
                    </div>
                </div>
                
                <div class="pet-details">
                    ${pet.breed ? `
                        <div class="pet-detail">
                            <div class="pet-detail-label">品种</div>
                            <div class="pet-detail-value">${pet.breed}</div>
                        </div>
                    ` : ''}
                    
                    ${pet.age ? `
                        <div class="pet-detail">
                            <div class="pet-detail-label">年龄</div>
                            <div class="pet-detail-value">${pet.age}岁</div>
                        </div>
                    ` : ''}
                    
                    ${pet.gender ? `
                        <div class="pet-detail">
                            <div class="pet-detail-label">性别</div>
                            <div class="pet-detail-value">${genderLabels[pet.gender]}</div>
                        </div>
                    ` : ''}
                    
                    ${pet.weight ? `
                        <div class="pet-detail">
                            <div class="pet-detail-label">体重</div>
                            <div class="pet-detail-value">${pet.weight}kg</div>
                        </div>
                    ` : ''}
                </div>
                
                ${pet.vaccination || pet.notes ? `
                    <div class="pet-additional-info">
                        ${pet.vaccination ? `
                            <div class="pet-detail">
                                <div class="pet-detail-label">疫苗记录</div>
                                <div class="pet-detail-value">${pet.vaccination}</div>
                            </div>
                        ` : ''}
                        
                        ${pet.notes ? `
                            <div class="pet-detail">
                                <div class="pet-detail-label">备注</div>
                                <div class="pet-detail-value">${pet.notes}</div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="pet-actions">
                    <button class="btn btn-secondary" onclick="petManager.showEditForm('${pet.id}')">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-danger" onclick="petManager.deletePet('${pet.id}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 加载宠物数据
    loadPets() {
        try {
            const data = localStorage.getItem('petPartyPets');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('加载宠物数据失败:', e);
            return [];
        }
    }

    // 保存宠物数据
    savePets() {
        try {
            localStorage.setItem('petPartyPets', JSON.stringify(this.pets));
        } catch (e) {
            console.error('保存宠物数据失败:', e);
            this.showNotification('保存数据失败，请检查浏览器存储设置', 'error');
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 只在宠物配置页面初始化
    if (document.getElementById('pet-list')) {
        window.petManager = new PetManager();
    }
});