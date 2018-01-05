var vm = new Vue({

	el: '#parent',
	data: {

		//搜索门店
		search_val: '',
		//总页数
		all_pages: 0,
		//页面数
		pages: 0,
		//页面数量
		pages_val: 10,
		//	    //门店id
		//	    city_id:'',

		//门店列表
		store_list: [],
		//移动端数据
		mobile_store_list: [],
		//移动端上拉加载控制开关
		slide_up_onff:true,
		
		
		

		//地区选择
		select_index: 0,
		area_list: [],
		//城市id
		city_id: '',
		//当前城市
		current_city: '',
		//地区下拉关闭展示
		area_off: true

	},
	mounted: function() {

		var self = this;

		if(window.localStorage.getItem('search_store')) {

			self.search_val = window.localStorage.getItem('search_store');

		}
		if(window.localStorage.getItem('city_id')) {

			self.city_id = window.localStorage.getItem('city_id');

		}

		//地区展示
		self.area_show();

		//门店搜索
		self.search_store();

	},
	methods: {

		//地区
		select_area: function() {

			$('.select_area').show();

		},
		//选择
		select: function(ev) {

			var self = this;

			var index = ev.target.attributes.data_index.value;

			self.select_index = index;

			self.city_id = ev.target.attributes.data_id.value;

			self.current_city = ev.target.attributes.area_val.value;

			$('.select_area').hide();

		},
		//地区展示
		area_show: function() {
			var self = this;
			$.ajax({
				url: globalData.url + '/index.php?g=&m=api&a=city_api',
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 1) {

						self.area_list = res.data;

						//获取之前地址选取的索引值
						console.log(res.data.length);
						for(var i = 0; i < res.data.length; i++) {

							if(res.data[i].id == window.localStorage.getItem('city_id')) {

								self.select_index = i;

								self.city_id = res.data[i].id;

								self.current_city = res.data[i].city_name;
							}
						}
					}
				}
			})
		},
		//搜索门店
		search_store: function() {
            
            //加载图标显示
			$('.loading').show();
            
			var self = this;
			$.ajax({
				url: globalData.url + '/index.php?g=&m=api&a=search_api',
				type: 'post',
				data: {
					search_val: self.search_val,
					page_start: self.pages,
					page_end: self.pages_val,
					city_id: self.city_id
				},
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 1) {

						self.store_list = res.data.arr;

//						self.mobile_store_list = res.data.arr;
						
						var data=res.data.arr;
						
						var old_data=self.mobile_store_list;

						if(self.pages == 0) {
							
							self.all_pages = res.data.page.sum_data_num;
							
							self.mobile_store_list=data;
						}else{
							
							for(var i=0;i<data.length;i++){
								
								old_data.push(data[i]);
							}
							
							self.mobile_store_list=old_data;
						}
						
						//上拉加载开关
						vm.slide_up_onff=true;
						
						//加载图标隐藏
						$('.loading').hide();
					}else{
						
						$('.loading p').html('未查询到数据！！！');
						setTimeout(function(){
							
							$('.loading').hide();
							
						},1500);
						
					}
				}
			})
		},

		//搜索  输入门店名称查询
		search: function() {
			var self = this;

			if(self.search_store == '') {

				return;
			}

			self.pages = 0;
			self.pages_val = 10;

			self.search_store();

		},

		//店面详情
		store_details: function(ev) {

			var id = ev.target.attributes.data_id.value;

			window.localStorage.setItem('store_id', id);
			window.location.href = './store_details.html';

		}
	}
});

//门店分页
$("#page").paging({
	pageNo: (vm.pages + 1),
	totalPage: (vm.all_pages + 1),
	totalSize: Number(vm.all_pages) * Number(vm.pages_val),
	callback: function(num) {
		vm.pages = (num - 1);
		vm.search_store();
	}
});

//移动端启用上拉加载
if($(window).width()<992) {

	$(window).scroll(function() {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		var positionValue = (scrollTop + windowHeight) - scrollHeight;
		if(positionValue >= 0) {
			
			var current_page=Number(vm.pages);
			var current_data=Number(current_page+1)*Number(vm.pages_val);
			
			if(vm.slide_up_onff && current_data<vm.all_pages){
				
				 
				  vm.slide_up_onff=false;
			
			      vm.pages=Number(current_page)+Number(vm.pages_val);
			      
			      vm.search_store();
			}
		}
	});
}




//按回车键搜索
function key_search(event){
	
   var  ev=event || window.event;
   
   if(ev.keyCode==13){
   	    setTimeout(function(){
   	    	vm.search();
   	    },1000);
   }
}
