var vm = new Vue({

	el: '#parent',
	data: {

		//搜索门店
		search_store: '',
		//门店id  
		store_id: '',

		//门店数据
		store_data: '',
		//轮番图
		banner: [],
		//距离
		distance: 0,

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

		if(window.localStorage.getItem('store_id')) {

			self.store_id = window.localStorage.getItem('store_id');

		}
		//获取地区
		self.area_show();

		//获取店面详情数据
		self.get_data();
	},
	methods: {

		//地区选择
		select_area: function() {
			var self = this;
			if(self.area_off) {
				$('.select_area').show();
			} else {
				$('.select_area').hide();
			}
			self.area_off = !self.area_off;
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

		//门店数据获取
		get_data: function() {
			var self = this;
			$.ajax({
				url: globalData.url + '/index.php?g=&m=api&a=store_details_api',
				type: 'post',
				data: {
					store_id: self.store_id
				},
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 1) {

						self.banner = res.data.img_list;

						self.store_data = res.data;

						var html_str = null;

						for(var i = 0; i < res.data.img_list.length; i++) {
							if(i == 0) {
								html_str = '<li data-target="#myCarousel" data-slide-to="' + i + '" class="active" ></li>'
							} else {
								html_str += '<li data-target="#myCarousel" data-slide-to="' + i + '"></li>'
							}

						}
						$('.banner_bot').html(html_str);
						
						//电话号
						$('.tell_iphone a').attr('href','tel:'+res.data.store_tel);

						//计算距离
						// 百度地图API功能
						var sContent =
							"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+res.data.store_name+"</h4>" +
							"<img style='float:right;margin:4px' id='imgDemo' src='"+res.data.img_list[0].store_img+"' width='35%' height='auto' title='天安门'/>" +
							"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em;width:60%;'>"+res.data.store_dec+"</p>" +
							"</div>";
						
						var map = new BMap.Map("allmap");
						var point = new BMap.Point(res.data.store_map_lng, res.data.store_map_lat);
//						map.centerAndZoom("北京", 12); //初始化地图,设置城市和地图级别。

						var point = new BMap.Point(res.data.store_map_lng, res.data.store_map_lat);
						var marker = new BMap.Marker(point);
						var infoWindow = new BMap.InfoWindow(sContent); // 创建信息窗口对象
						map.centerAndZoom(point, 15);
						map.addOverlay(marker);
						marker.addEventListener("click", function() {
							this.openInfoWindow(infoWindow);
							//图片加载完毕重绘infowindow
							document.getElementById('imgDemo').onload = function() {
								infoWindow.redraw(); //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
							}
						});

						var geolocation = new BMap.Geolocation();
						geolocation.getCurrentPosition(function(r) {
							if(this.getStatus() == BMAP_STATUS_SUCCESS) {

								//当前位置
								var pointA = new BMap.Point(r.point.lng, r.point.lat); // 创建点坐标A--大渡口区
								//目的地
								var pointB = new BMap.Point(res.data.store_map_lng, res.data.store_map_lat); // 创建点坐标B--江北区
								//								alert('从大渡口区到江北区的距离是：' + (Number(map.getDistance(pointA, pointB))/1000).toFixed(2) + ' 米。'); //获取两点距离,保留小数点后两位

								self.distance = (Number(map.getDistance(pointA, pointB)) / 1000).toFixed(2);

							} else {
								alert('failed' + this.getStatus());
							}
						}, {
							enableHighAccuracy: true
						})

					}
				}
			});
		},
		//搜索
		search: function() {
			var self = this;
			if(self.search_store == '') {

				return;
			}
			
			window.localStorage.setItem('search_store', self.search_store);
			window.localStorage.setItem('city_id', self.city_id);
			window.location.href = './store_list.html';
		},
	}
});


//按回车键搜索
function key_search(event){
	
   var  ev=event || window.event;
   
   if(ev.keyCode==13){
   	
 	    setTimeout(function(){
   	    	vm.search();
   	    },1000);
   	
   }
	
}