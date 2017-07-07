package com.run.sx.zhzx.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.run.sx.zhzx.comm.aop.LoggerManage;

/**
 * @author hupeng
 * 2017年7月7日
 * 陕西指挥大屏第一屏控制器
 */
@Controller
@RequestMapping("/screen1")
public class Screen1Controller extends BaseController {
	
	/**
	 * 第一屏入口
	 * @param model
	 * @return
	 */
	@RequestMapping(value = "/index",method = RequestMethod.GET)
	@LoggerManage(description = "首页")
	public String index (Model model) {
		return "screen1";
	}
	
	
}
