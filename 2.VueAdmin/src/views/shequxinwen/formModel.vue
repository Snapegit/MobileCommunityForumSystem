<template>
	<div>
		<el-dialog v-model="formVisible" :title="formTitle" width="80%" destroy-on-close :fullscreen='false'>
			<el-form class="formModel_form" ref="formRef" :model="form" label-width="$template2.back.add.form.base.labelWidth" :rules="rules">
				<el-row>
					<el-col :span="12">
						<el-form-item label="标题" prop="biaoti">
							<el-input class="list_inp" v-model="form.biaoti" placeholder="标题"
								 type="text" 								:readonly="!isAdd||disabledForm.biaoti?true:false" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="图片" prop="tupian">
							<uploads
								:disabled="!isAdd||disabledForm.tupian?true:false"
								action="file/upload" 
								tip="请上传图片" 
								:limit="3" 
								style="width: 100%;text-align: left;"
								:fileUrls="form.tupian?form.tupian:''" 
								@change="tupianUploadSuccess">
							</uploads>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="类型" prop="leixing">
							<el-input class="list_inp" v-model="form.leixing" placeholder="类型"
								 type="text" 								:readonly="!isAdd||disabledForm.leixing?true:false" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="发布日期" prop="faburiqi">
							<el-date-picker
								class="list_date"
								v-model="form.faburiqi"
								format="YYYY 年 MM 月 DD 日"
								value-format="YYYY-MM-DD"
								type="datetime"
								:readonly="!isAdd||disabledForm.faburiqi?true:false"
								placeholder="请选择发布日期" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="简介" prop="jianjie">
							<el-input v-model="form.jianjie" placeholder="简介" type="textarea"
							:readonly="!isAdd||disabledForm.jianjie?true:false"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="内容" prop="neirong">
							<editor :value="form.neirong" placeholder="请输入内容" :readonly="!isAdd||disabledForm.neirong?true:false"
								class="list_editor" @change="(e)=>editorChange(e,'neirong')"></editor>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer v-if="isAdd||type=='logistics'||type=='reply'">
				<span class="formModel_btn_box">
					<el-button class="formModel_cancel" @click="closeClick">取消</el-button>
					<el-button class="formModel_confirm" type="primary" @click="save"
						>
						提交
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance,
		nextTick,
		computed,
		defineEmits
	} from 'vue'
	const context = getCurrentInstance()?.appContext.config.globalProperties;	
	const emit = defineEmits(['formModelChange'])
	//基础信息
	const tableName = 'shequxinwen'
	const formName = '社区新闻'
	//基础信息
	//form表单
	const form = ref({})
	const disabledForm = ref({
		biaoti : false,
		tupian : false,
		jianjie : false,
		leixing : false,
		neirong : false,
		faburiqi : false,
		storeupnum : false,
		userid : false,
	})
	const formVisible = ref(false)
	const isAdd = ref(false)
	const formTitle = ref('')
	//表单验证
	//匹配整数
	const validateIntNumber = (rule, value, callback) => {
		if (!value) {
			callback();
		} else if (!context?.$toolUtil.isIntNumer(value)) {
			callback(new Error("请输入整数"));
		} else {
			callback();
		}
	}
	//匹配数字
	const validateNumber = (rule, value, callback) => {
		if(!value){
			callback();
		} else if (!context?.$toolUtil.isNumber(value)) {
			callback(new Error("请输入数字"));
		} else {
			callback();
		}
	}
	//匹配手机号码
	const validateMobile = (rule, value, callback) => {
		if(!value){
			callback();
		} else if (!context?.$toolUtil.isMobile(value)) {
			callback(new Error("请输入正确的手机号码"));
		} else {
			callback();
		}
	}
	//匹配电话号码
	const validatePhone = (rule, value, callback) => {
		if(!value){
			callback();
		} else if (!context?.$toolUtil.isPhone(value)) {
			callback(new Error("请输入正确的电话号码"));
		} else {
			callback();
		}
	}
	//匹配邮箱
	const validateEmail = (rule, value, callback) => {
		if(!value){
			callback();
		} else if (!context?.$toolUtil.isEmail(value)) {
			callback(new Error("请输入正确的邮箱地址"));
		} else {
			callback();
		}
	}
	//匹配身份证
	const validateIdCard = (rule, value, callback) => {
		if(!value){
			callback();
		} else if (!context?.$toolUtil.checkIdCard(value)) {
			callback(new Error("请输入正确的身份证号码"));
		} else {
			callback();
		}
	}
	//匹配网站地址
	const validateUrl = (rule, value, callback) => {
		if(!value){
			callback();
		} else if (!context?.$toolUtil.isURL(value)) {
			callback(new Error("请输入正确的URL地址"));
		} else {
			callback();
		}
	}
	const rules = ref({
		biaoti: [
			{required: true,message: '请输入',trigger: 'blur'}, 
		],
		tupian: [
			{required: true,message: '请输入',trigger: 'blur'}, 
		],
		jianjie: [
		],
		leixing: [
		],
		neirong: [
			{required: true,message: '请输入',trigger: 'blur'}, 
		],
		faburiqi: [
		],
		storeupnum: [
			{ validator: validateIntNumber, trigger: 'blur' },
		],
		userid: [
			{required: true,message: '请输入',trigger: 'blur'}, 
		],
	})
	//表单验证
	
	const formRef = ref(null)
	const id = ref(0)
	const type = ref('')
	//图片上传回调
	const tupianUploadSuccess=(e)=>{
		form.value.tupian = e
	}
	//methods

	//获取唯一标识
	const getUUID =()=> {
      return new Date().getTime();
    }
	//重置
	const resetForm = () => {
		form.value = {
			biaoti: '',
			tupian: '',
			jianjie: '',
			leixing: '',
			neirong: '',
			faburiqi: '',
			storeupnum: '0',
			userid: '',
		}
	}
	//获取info
	const getInfo = ()=>{
		context?.$http({
			url: `${tableName}/info/${id.value}`,
			method: 'get'
		}).then(res => {
			let reg=new RegExp('../../../file','g')
			res.data.data.neirong = res.data.data.neirong?(res.data.data.neirong.replace(reg,'../../../cl55820223/file')):'';
			form.value = res.data.data
			formVisible.value = true
		})
	}
	const crossRow = ref('')
	const crossTable = ref('')
	const crossTips = ref('')
	const crossColumnName = ref('')
	const crossColumnValue = ref('')
	//初始化
	const init=(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null)=>{
		resetForm()
			form.value.faburiqi = context?.$toolUtil.getCurDate()
		if(formId){
			id.value = formId
			type.value = formType
		}
		if(formType == 'add'){
			isAdd.value = true
			formTitle.value = '新增' + formName
			formVisible.value = true
		}else if(formType == 'info'){
			isAdd.value = false
			formTitle.value = '查看' + formName
			getInfo()
		}else if(formType == 'edit'){
			isAdd.value = true
			formTitle.value = '修改' + formName
			getInfo()
		}
		else if(formType == 'cross'){
			isAdd.value = true
			formTitle.value = formNames
			// getInfo()
			for(let x in row){
				if(x=='biaoti'){
					form.value.biaoti = row[x];
					disabledForm.value.biaoti = true;
					continue;
				}
				if(x=='tupian'){
					form.value.tupian = row[x];
					disabledForm.value.tupian = true;
					continue;
				}
				if(x=='jianjie'){
					form.value.jianjie = row[x];
					disabledForm.value.jianjie = true;
					continue;
				}
				if(x=='leixing'){
					form.value.leixing = row[x];
					disabledForm.value.leixing = true;
					continue;
				}
				if(x=='neirong'){
					form.value.neirong = row[x];
					disabledForm.value.neirong = true;
					continue;
				}
				if(x=='faburiqi'){
					form.value.faburiqi = row[x];
					disabledForm.value.faburiqi = true;
					continue;
				}
				if(x=='storeupnum'){
					form.value.storeupnum = row[x];
					disabledForm.value.storeupnum = true;
					continue;
				}
				if(x=='userid'){
					form.value.userid = row[x];
					disabledForm.value.userid = true;
					continue;
				}
			}
			if(row){
				crossRow.value = row
			}
			if(table){
				crossTable.value = table
			}
			if(tips){
				crossTips.value = tips
			}
			if(statusColumnName){
				crossColumnName.value = statusColumnName
			}
			if(statusColumnValue){
				crossColumnValue.value = statusColumnValue
			}
			form.value.storeupnum='0'
			formVisible.value = true
		}

		context?.$http({
			url: `${context?.$toolUtil.storageGet('sessionTable')}/session`,
			method: 'get'
		}).then(res => {
			var json = res.data.data
		})
	}
	//初始化
	//声明父级调用
	defineExpose({
		init
	})
	//关闭
	const closeClick = () => {
		formVisible.value = false
	}
	//富文本
	const editorChange = (e,name) =>{
		form.value[name] = e
	}
	//提交
	const save=()=>{
		form.value.userid = context?.$toolUtil.storageGet('userid')
		if(form.value.tupian!=null) {
			form.value.tupian = form.value.tupian.replace(new RegExp(context?.$config.url,"g"),"");
		}
		var table = crossTable.value
		var objcross = JSON.parse(JSON.stringify(crossRow.value))
		let crossUserId = ''
		let crossRefId = ''
		let crossOptNum = ''
		if(type.value == 'cross'){
			if(crossColumnName.value!=''){
				if(!crossColumnName.value.startsWith('[')){
					for(let o in objcross){
						if(o == crossColumnName.value){
							objcross[o] = crossColumnValue.value
						}
					}
					//修改跨表数据
					changeCrossData(objcross)
				}else{
					crossUserId = context?.$toolUtil.storageGet('userid')
					crossRefId = objcross['id']
					crossOptNum = crossColumnName.value.replace(/\[/,"").replace(/\]/,"")
				}
			}
		}
		formRef.value.validate((valid)=>{
			if(valid){
				if(crossUserId&&crossRefId){
					form.value.crossuserid = crossUserId
					form.value.crossrefid = crossRefId
					let params = {
						page: 1,
						limit: 1000, 
						crossuserid:form.value.crossuserid,
						crossrefid:form.value.crossrefid,
					}
					context?.$http({
						url: `${tableName}/page`,
						method: 'get', 
						params: params 
					}).then(res=>{
						if(res.data.data.total>=crossOptNum){
							context?.$toolUtil.message(`${crossTips.value}`,'error')
							return false
						}else{
							context?.$http({
								url: `${tableName}/${!form.value.id ? "save" : "update"}`,
								method: 'post', 
								data: form.value 
							}).then(res=>{
								context?.$toolUtil.message(`操作成功`,'success',()=>{
									formVisible.value = false
									emit('formModelChange')
								})
							})
						}
					})
				}else{
					context?.$http({
						url: `${tableName}/${!form.value.id ? "save" : "update"}`,
						method: 'post', 
						data: form.value 
					}).then(res=>{
						context?.$toolUtil.message(`操作成功`,'success',()=>{
							formVisible.value = false
							emit('formModelChange')
						})
					})
				}
			}
		})
	}
	//修改跨表数据
	const changeCrossData=(row)=>{
		context?.$http({
			url: `${crossTable.value}/update`,
			method: 'post',
			data: row
		}).then(res=>{})
	}
</script>
<style lang="scss" scoped>
	// 表单
	.formModel_form{
		border: 0px solid rgba(254, 182, 203, 0.5);
		border-radius: 0px;
		padding: 40px 30px;
		margin: 0;
		background: #fff;
		// form item
		:deep(.el-form-item) {
			margin: 0 150px 20px 0;
			background: none;
			display: flex;
			//label
			.el-form-item__label {
			 color: #666;
			 background: none;
			 font-weight: 500;
			 display: block;
			 width: 150px;
			 text-align: right;
			 min-width: 150px;
			}
			// 内容盒子
			.el-form-item__content {
				display: flex;
				width: calc(100% - 120px);
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				// 输入框
				.list_inp {
					border: 1px solid rgba(255, 255, 255, 0.25);
					border-radius: 0px;
					padding: 0 10px;
					color: #666;
					background: rgba(0, 0, 0, 0.1);
					width: auto;
					line-height: 36px;
					box-sizing: border-box;
					min-width: 350px;
					height: 36px;
					//去掉默认样式
					.el-input__wrapper{
						border: none;
						box-shadow: none;
						background: none;
						border-radius: 0;
						height: 100%;
						padding: 0;
					}
					.is-focus {
						box-shadow: none !important;
					}
				}
				//日期选择器
				.list_date {
					border: 1px solid rgba(255, 255, 255, 0.25);
					border-radius: 0px;
					color: #666;
					background: rgba(0, 0, 0, 0.1);
					width: auto;
					line-height: 36px;
					box-sizing: border-box;
					min-width: 250px;
					//去掉默认样式
					.el-input__wrapper{
						border: none;
						box-shadow: none;
						background: none;
						border-radius: 0;
						height: 100%;
					}
				}
				// 富文本
				.list_editor {
					border-radius: 0;
					padding: 0;
					margin: 0;
					color: #999;
					background: rgba(0, 0, 0, 0.1);
					width: 100%;
					border-color: #ccc;
					border-width: 0;
					border-style: solid;
					height: auto;
				}
				// 长文本
				.el-textarea__inner {
					border: 1px solid rgba(255, 255, 255, 0.25);
					border-radius: 0;
					padding: 12px;
					color: #666;
					background: rgba(0, 0, 0, 0.1);
					width: auto;
					font-size: 14px;
					min-height: 120px;
					min-width: 450px;
				}
				//图片上传样式
				.el-upload-list  {
					//提示语
					.el-upload__tip {
						margin: 7px 0 0;
						color: #999;
						display: flex;
						font-size: 14px;
						justify-content: flex-start;
						align-items: center;
					}
					//外部盒子
					.el-upload--picture-card {
						border: 1px solid rgba(255, 255, 255, 0.25);
						cursor: pointer;
						border-radius: 0px;
						background: rgba(0, 0, 0, 0.1);
						width: 120px;
						line-height: 70px;
						text-align: center;
						height: 60px;
						//图标
						.el-icon{
							color: #999;
							font-size: 26px;
						}
					}
					.el-upload-list__item {
						border: 1px solid rgba(255, 255, 255, 0.25);
						cursor: pointer;
						border-radius: 0px;
						background: rgba(0, 0, 0, 0.1);
						width: 120px;
						line-height: 70px;
						text-align: center;
						height: 60px;
					}
				}
			}
		}
	}
	// 按钮盒子
	.formModel_btn_box {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		.formModel_cancel {
			border: 1px solid #d43f3a;
			cursor: pointer;
			border-radius: 3px;
			padding: 0 24px;
			margin: 0 20px 0 0;
			outline: none;
			color: #fff;
			background: rgba(217, 83, 79, 0.45);
			width: auto;
			font-size: 14px;
			min-width: 100px;
			height: 36px;
		}
		.formModel_cancel:hover {
		}
		
		.formModel_confirm {
			border: 1px solid #357ebd;
			cursor: pointer;
			border-radius: 3px;
			padding: 0 24px;
			margin: 0 20px 0 0;
			outline: none;
			color: #fff;
			background: rgba(66, 139, 202, 0.55);
			width: auto;
			font-size: 14px;
			min-width: 100px;
			height: 36px;
		}
		.formModel_confirm:hover {
		}
	}
</style>