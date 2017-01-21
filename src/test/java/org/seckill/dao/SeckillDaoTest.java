package org.seckill.dao;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.seckill.entity.Seckill;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * 配置spring和junit整合，junit启动时加载springIOC容器 spring-test,junit
 */
@RunWith(SpringJUnit4ClassRunner.class)
// 告诉junit spring的配置文件
@ContextConfiguration( { "classpath:spring/spring-dao.xml" })
public class SeckillDaoTest {

	// 注入Dao实现类依赖
	@Resource
	private SeckillDao seckillDao;

	@Test
	public void testQueryById() throws Exception {
		long id = 1000;
		Seckill seckill = seckillDao.queryById(id);
		System.out.println(seckill.getName());
		System.out.println(seckill);
	}

	@Test
	public void testQueryAll() throws Exception {
		// 注意接口中要用mybatis注解详细说明参数，否则java编译后变成arg0,arg1识别不出
		List<Seckill> seckills = seckillDao.queryAll(0, 100);
		for (Seckill seckill : seckills) {
			System.out.println(seckill);
		}
	}

	@Test
	public void testReduceNumber() throws Exception {
		Date killTime = new Date();
		// 减库存其实是一条update语句，返回值只能是 1或0
		int updateCount = seckillDao.reduceNumber(1000L, killTime);
		//因为end_time已经过去了，所以现在测试返回都是0
		System.out.println("更新了多少条记录:"+updateCount);
	}
}
