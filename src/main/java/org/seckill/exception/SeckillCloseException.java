package org.seckill.exception;

/**
 * 秒杀关闭异常（时间已到，库存完）
 * 
 * @author Administrator
 * 
 */
public class SeckillCloseException extends SeckillException {

	public SeckillCloseException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

	public SeckillCloseException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

}
