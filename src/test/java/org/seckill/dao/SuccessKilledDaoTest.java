package org.seckill.dao;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.seckill.entity.SuccessKilled;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
/**
 * 配置spring和junit整合，junit启动时加载springIOC容器 spring-test,junit
 */
@RunWith(SpringJUnit4ClassRunner.class)
// 告诉junit spring的配置文件
@ContextConfiguration( { "classpath:spring/spring-dao.xml" })
public class SuccessKilledDaoTest {
	
	@Resource
	private SuccessKilledDao successKilledDao;
	
	@Test
	public void testInsertSuccessKilled() throws Exception{
		long id = 1000L;
		long phone = 15240715098L;
		int insertCount = successKilledDao.insertSuccessKilled(id, phone);
		System.out.println("插入记录的条数是："+insertCount);
	}

	@Test
	public void testQueryByIdWithSeckill()throws Exception {
		long id = 1000L;
		long phone = 15240715098L;
		SuccessKilled successKilled = successKilledDao.queryByIdWithSeckill(id, phone);
		System.out.println("秒杀成功："+successKilled);
		//System.out.println(successKilled.getSeckill());
	}

}
