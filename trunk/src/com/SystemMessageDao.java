package com;

// Generated Jan 11, 2012 5:50:27 PM by Hibernate Tools 3.4.0.CR1

import java.util.List;
import javax.naming.InitialContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Example;

import com.integral.system.message.bean.SystemMessage;

/**
 * Home object for domain model class SystemMessage.
 * @see com.integral.system.message.bean.SystemMessage
 * @author Hibernate Tools
 */
public class SystemMessageDao {

    private static final Log log = LogFactory.getLog(SystemMessageDao.class);

    private final SessionFactory sessionFactory = getSessionFactory();

    protected SessionFactory getSessionFactory() {
        try {
            return (SessionFactory) new InitialContext().lookup("SessionFactory");
        }
        catch (Exception e) {
            log.error("Could not locate SessionFactory in JNDI", e);
            throw new IllegalStateException("Could not locate SessionFactory in JNDI");
        }
    }

    public void persist(SystemMessage transientInstance) {
        log.debug("persisting SystemMessage instance");
        try {
            sessionFactory.getCurrentSession().persist(transientInstance);
            log.debug("persist successful");
        }
        catch (RuntimeException re) {
            log.error("persist failed", re);
            throw re;
        }
    }

    public void attachDirty(SystemMessage instance) {
        log.debug("attaching dirty SystemMessage instance");
        try {
            sessionFactory.getCurrentSession().saveOrUpdate(instance);
            log.debug("attach successful");
        }
        catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }

    public void attachClean(SystemMessage instance) {
        log.debug("attaching clean SystemMessage instance");
        try {
            sessionFactory.getCurrentSession().lock(instance, LockMode.NONE);
            log.debug("attach successful");
        }
        catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }

    public void delete(SystemMessage persistentInstance) {
        log.debug("deleting SystemMessage instance");
        try {
            sessionFactory.getCurrentSession().delete(persistentInstance);
            log.debug("delete successful");
        }
        catch (RuntimeException re) {
            log.error("delete failed", re);
            throw re;
        }
    }

    public SystemMessage merge(SystemMessage detachedInstance) {
        log.debug("merging SystemMessage instance");
        try {
            SystemMessage result = (SystemMessage) sessionFactory.getCurrentSession().merge(detachedInstance);
            log.debug("merge successful");
            return result;
        }
        catch (RuntimeException re) {
            log.error("merge failed", re);
            throw re;
        }
    }

    public SystemMessage findById(java.lang.String id) {
        log.debug("getting SystemMessage instance with id: " + id);
        try {
            SystemMessage instance = (SystemMessage) sessionFactory.getCurrentSession().get("com.SystemMessage", id);
            if (instance == null) {
                log.debug("get successful, no instance found");
            }
            else {
                log.debug("get successful, instance found");
            }
            return instance;
        }
        catch (RuntimeException re) {
            log.error("get failed", re);
            throw re;
        }
    }

    public List findByExample(SystemMessage instance) {
        log.debug("finding SystemMessage instance by example");
        try {
            List results = sessionFactory.getCurrentSession().createCriteria("com.SystemMessage")
                    .add(Example.create(instance)).list();
            log.debug("find by example successful, result size: " + results.size());
            return results;
        }
        catch (RuntimeException re) {
            log.error("find by example failed", re);
            throw re;
        }
    }
}
