package com.integral.system.menu.dao;

import java.util.Collection;
import java.util.List;

import com.integral.system.menu.bean.MenuInfo;

/** 
 * <p>Description: [描述该类概要功能介绍]</p>
 * @author  <a href="mailto: swpigris81@126.com">Chao Dai</a>
 * @createDate May 18, 2011
 */
public interface IMenuDao {
    /**
     * <p>Discription:[查询所有的菜单，返回菜单的名称。用于权限管理]</p>
     * @return
     * @author: 代超
     * @update: 2011-6-2 代超[变更描述]
     */
    public List findAllMenu();
    /**
     * <p>Discription:[查询所有菜单的路径信息。用于权限管理]</p>
     * @return
     * @author: 代超
     * @update: 2011-6-2 代超[变更描述]
     */
    public List findAllMenuPath();
    /**
     * <p>Discription:[查询父菜单下的子菜单]</p>
     * @param rootMenuId
     * @return
     * @author 代超
     * @update 2011-5-29 代超[变更描述]
     */
    public List findChildMenu(String rootMenuId);
    /**
     * <p>Discription:[查询父级菜单]</p>
     * @return
     * @author: 代超
     * @update: 2011-6-25 代超[变更描述]
     */
    public List findRootMenu();
    /**
     * 查询所有的菜单全部信息
     * <p>Discription:[方法功能描述]</p>
     * @return
     * @author: 代超
     * @update: 2011-6-2 代超[变更描述]
     */
    public List findAll();
    /**
     * <p>Discription:[分页查询菜单信息]</p>
     * @param start
     * @param limit
     * @return
     * @author: 代超
     * @update: 2011-6-2 代超[变更描述]
     */
    public List findMenuByPage(int start, int limit);
    
    /**
     * <p>Discription:[添加或修改菜单信息]</p>
     * @param menu
     * @author: 代超
     * @update: 2011-6-25 代超[变更描述]
     */
    public void saveOrUpdateMenu(MenuInfo menu);
    /**
     * <p>Discription:[使用主键查询]</p>
     * @param menuId
     * @return
     * @author: 代超
     * @update: 2011-6-25 代超[变更描述]
     */
    public MenuInfo findById(String menuId);
    /**
     * <p>Discription:[批量删除菜单信息]</p>
     * @param menus
     * @author: 代超
     * @update: 2011-6-25 代超[变更描述]
     */
    public void deleteAll(Collection menus);
}
