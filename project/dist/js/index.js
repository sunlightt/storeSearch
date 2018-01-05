var vm = new Vue({

	el: '#parent',
	data: {

		//搜索门店
		search_store: '',

		//地区选择
		select_index: 0,
		area_list: [],
		//城市id
		city_id: '',
		//当前城市
		current_city: '',
		//地区下拉关闭展示
		area_off: true,

		//热门搜索
		hot_sea: []

	},
	created: function() {
		var self = this;
		self.area_show();
	},
	mounted: function() {

		var self = this;

		self.hot_search();

	},
	methods: {

		//搜索
		search: function() {
			var self = this;
			if(self.search_store == '') {

				return;
			}
			window.localStorage.setItem('search_store', self.search_store);
			window.localStorage.setItem('city_id', self.city_id);
			window.location.href = './pages/store_list.html';
		},
		//通过标签搜索
		hot_search_store: function(ev) {

			var self = this;

			var search_val = ev.target.attributes.search_val.value;

			window.localStorage.setItem('search_store', search_val);
			window.localStorage.setItem('city_id', self.city_id);
			window.location.href = './pages/store_list.html';
		},

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
						console.log(res.data);
						self.area_list = res.data;

//						self.city_id = res.data[0].id;
//
//						self.current_city = res.data[0].city_name;

                        //默认定位北京
						self.current_city == '北京';
						for(var j = 0; j < res.data.length; j++) {

							if(res.data[j].city_name == '北京') {

								self.city_id = res.data[j].id;

								self.select_index = j;
								
							    window.localStorage.setItem('city_id',res.data[j].id);

							}
						}

						//自动定位
						// 百度地图API功能
						var map = new BMap.Map("allmap");
						var point = new BMap.Point(116.331398, 39.897445);
						map.centerAndZoom(point, 12);
						var geolocation = new BMap.Geolocation();
						var geoc = new BMap.Geocoder();

						geolocation.getCurrentPosition(function(r) {
							if(this.getStatus() == BMAP_STATUS_SUCCESS) {

								geoc.getLocation(r.point, function(rs) {
									var addComp = rs.addressComponents;

									self.current_city = addComp.city;

									for(var i = 0; i < res.data.length; i++) {

										if(self.current_city.indexOf(res.data[i].city_name) != -1) {

											self.current_city =res.data[i].city_name;

											self.city_id = res.data[i].id;

											self.select_index = i;
											
											window.localStorage.setItem('city_id',res.data[i].id);
                                            
										} 
									}
								});
							} else {
								alert('failed' + this.getStatus());
							}
						}, {
							enableHighAccuracy: true
						})
					}
				}
			})
		},
		//热门推荐
		hot_search: function() {

			var self = this;

			$.ajax({
				url: globalData.url + '/index.php?g=&m=api&a=hot_api',
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 1) {

						self.hot_sea = res.data;
					}
				}
			})
		}
	}
});

//按回车键搜索
function key_search(event) {

	var ev = event || window.event;

	if(ev.keyCode == 13) {

		vm.search();

	}

}