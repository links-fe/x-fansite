// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// import NIM from '`@hbdevs/nim-sdk'
// import NIM from '@yxim/nim-web-sdk/dist/SDK/NIM_Web_NIM'
import { EnumRTMClientEvent } from './common'
import { Event } from '@hb-common/utils'
import { INimMessage, INimOfflineMessage, INimRoamMessage } from './type'

export * from './common'
export * from './type'

export class NimClient {
  constructor() {}
  private _nim: any
  private _event: Event<EnumRTMClientEvent> = new Event()
  private _emit(eventName: EnumRTMClientEvent, ...args: unknown[]) {
    this._event.emit(eventName, ...args)
  }

  private _instanceId: string

  public getInstanceId() {
    return this._instanceId
  }

  public async init(appKey: string, account: string, token: string) {
    // console.log('nim init', appKey, account, token)

    this._nim = await this._createNIM(appKey, account, token)
    // console.log('_nim', this._nim)
  }

  public async logout() {
    // this._nim?.dis()

    await this.disconnect()
    await this.destroy()
  }
  public disconnect() {
    return new Promise((resolve) => {
      this._nim?.disconnect({
        done: () => {
          resolve(true)
        },
      })
    })
  }
  public destroy() {
    return new Promise((resolve) => {
      this._nim?.destroy({
        done: () => {
          resolve(true)
        },
      })
    })
  }

  public async send(to: string, text: string, scene?: 'p2p' | 'team' | 'superTeam') {
    console.log('--> send', to, text, scene)
    // console.log('_nim', this._nim)

    this?._nim?.sendText({
      to,
      text,
      scene,
    })
  }

  // public on(
  //   key: string,
  //   eventName: EnumRTMClientEvent.MessageFromPeer,
  //   callback: (message: RtmMessage, peerId: string) => void,
  // ): void
  // public on(
  //   key: string,
  //   eventName: EnumRTMClientEvent.ConnectionStateChanged,
  //   callback: (newState: RtmStatusCode.ConnectionState, reason: RtmStatusCode.ConnectionChangeReason) => void,
  // ): void
  // public on(
  //   key: string,
  //   eventName: EnumRTMClientEvent.RemoteInvitationReceived,
  //   callback: (remoteInvitation: RemoteInvitation) => void,
  // ): void

  public on(
    key: string,
    eventName: EnumRTMClientEvent.OfflineChannelMessage,
    callback: (data: INimOfflineMessage) => void,
  ): void
  public on(
    key: string,
    eventName: EnumRTMClientEvent.RoamingChannelMessage,
    callback: (data: INimRoamMessage) => void,
  ): void
  public on(key: string, eventName: EnumRTMClientEvent.Connected, callback: () => void): void
  public on(key: string, eventName: EnumRTMClientEvent.Disconnected, callback: (errorCode: unknown) => void): void
  public on(
    key: string,
    eventName: EnumRTMClientEvent.WillReconnect,
    callback: (obj: { duration: number; retryCount: number }) => void,
  ): void
  public on(key: string, eventName: EnumRTMClientEvent.Error, callback: (e: unknown) => void): void
  public on(key: string, eventName: EnumRTMClientEvent.NewChannelMessage, callback: (data: INimMessage) => void): void
  public on(key: string, eventName: EnumRTMClientEvent, callback: (data) => void): void {
    this._event.on(key, eventName, callback)
  }

  public emit(eventName: EnumRTMClientEvent.OfflineChannelMessage, data: INimOfflineMessage): void
  public emit(eventName: EnumRTMClientEvent.RoamingChannelMessage, data: INimRoamMessage): void
  public emit(eventName: EnumRTMClientEvent.Connected, data: unknown): void
  public emit(eventName: EnumRTMClientEvent.Disconnected, errorCode: unknown): void
  public emit(eventName: EnumRTMClientEvent.WillReconnect, obj: { duration: number; retryCount: number }): void
  public emit(eventName: EnumRTMClientEvent.Error, e: unknown): void
  public emit(eventName: EnumRTMClientEvent.NewChannelMessage, data: INimMessage): void
  public emit(eventName: EnumRTMClientEvent, data: unknown): void {
    this._emit(eventName, data)
  }

  private async _createNIM(appKey: string, account: string, token: string) {
    const data: any = {}

    const onConnect = () => {
      // console.log('连接成功')
      console.log('[nim] connected')
      this.emit(EnumRTMClientEvent.Connected, {})
    }
    const onWillReconnect = (obj) => {
      // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
      console.log('[nim] - onWillReconnect', obj)
      this.emit(EnumRTMClientEvent.WillReconnect, obj)
    }
    const onDisconnect = (error) => {
      // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
      console.log('[nim] - onDisconnect', error)
      this.emit(EnumRTMClientEvent.Disconnected, error.code)

      if (error) {
        switch (error.code) {
          // 账号或者密码错误, 请跳转到登录页面并提示错误
          case 302:
            break
          // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
          case 417:
            break
          // 被踢, 请提示错误后跳转到登录页面
          case 'kicked':
            break
          default:
            break
        }
      }
    }
    const onError = (error) => {
      console.log('[nim] - error', error)
      this.emit(EnumRTMClientEvent.Error, error)
    }

    // ! 勿删
    // function onLoginPortsChange(loginPorts) {
    //   console.log('当前登录帐号在其它端的状态发生改变了', loginPorts)
    // }

    function onBlacklist(blacklist) {
      console.log(`[nim] - 09211450`)
      // console.log('收到黑名单', blacklist)
      data.blacklist = nim.mergeRelations(data.blacklist, blacklist)
      data.blacklist = nim.cutRelations(data.blacklist, blacklist.invalid)
      refreshBlacklistUI()
    }
    function onMarkInBlacklist(obj) {
      // console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '黑名单', obj)
      console.log(`[nim] - 09211449`)

      if (obj.isAdd) {
        addToBlacklist(obj)
      } else {
        removeFromBlacklist(obj)
      }
    }
    function addToBlacklist(obj) {
      data.blacklist = nim.mergeRelations(data.blacklist, obj.record)
      refreshBlacklistUI()
    }
    function removeFromBlacklist(obj) {
      data.blacklist = nim.cutRelations(data.blacklist, obj.record)
      refreshBlacklistUI()
    }
    function refreshBlacklistUI() {
      // 刷新界面
    }
    function onMutelist(mutelist) {
      console.log('[nim] - onMutelist', mutelist)
      data.mutelist = nim.mergeRelations(data.mutelist, mutelist)
      data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid)
      refreshMutelistUI()
    }
    function onMarkInMutelist(obj) {
      // console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表', obj)
      console.log(`[nim] - 09211448`)

      if (obj.isAdd) {
        addToMutelist(obj)
      } else {
        removeFromMutelist(obj)
      }
    }
    function addToMutelist(obj) {
      data.mutelist = nim.mergeRelations(data.mutelist, obj.record)
      refreshMutelistUI()
    }
    function removeFromMutelist(obj) {
      data.mutelist = nim.cutRelations(data.mutelist, obj.record)
      refreshMutelistUI()
    }
    function refreshMutelistUI() {
      // 刷新界面
    }

    function onFriends(friends) {
      console.log('[nim] onFriends', friends)
      data.friends = nim.mergeFriends(data.friends, friends)
      data.friends = nim.cutFriends(data.friends, friends.invalid)
      refreshFriendsUI()
    }
    function onSyncFriendAction(obj) {
      console.log('[nim] - onSyncFriendAction', obj)
      switch (obj.type) {
        case 'addFriend':
          console.log('addFriend' + obj)
          onAddFriend(obj.friend)
          break
        case 'applyFriend':
          console.log('applyFriend' + obj)
          break
        case 'passFriendApply':
          console.log('passFriendApply' + obj)
          onAddFriend(obj.friend)
          break
        case 'rejectFriendApply':
          console.log('rejectFriendApply' + obj)
          break
        case 'deleteFriend':
          console.log('deleteFriend' + obj)
          onDeleteFriend(obj.account)
          break
        case 'updateFriend':
          console.log('updateFriend', obj)
          onUpdateFriend(obj.friend)
          break
      }
    }
    function onAddFriend(friend) {
      data.friends = nim.mergeFriends(data.friends, friend)
      refreshFriendsUI()
    }
    function onDeleteFriend(account) {
      data.friends = nim.cutFriendsByAccounts(data.friends, account)
      refreshFriendsUI()
    }
    function onUpdateFriend(friend) {
      data.friends = nim.mergeFriends(data.friends, friend)
      refreshFriendsUI()
    }
    function refreshFriendsUI() {
      // 刷新界面
    }

    function onMyInfo(user) {
      // console.log('收到我的名片', user)
      console.log('[nim] onMyInfo', user)

      data.myInfo = user
      updateMyInfoUI()
    }

    function updateMyInfoUI() {
      // 刷新界面
    }
    function onUsers(users) {
      // console.log('收到用户名片列表', users)
      console.log('[nim] onUsers', users)
      data.users = nim.mergeUsers(data.users, users)
    }
    function onUpdateUser(user) {
      // console.log('用户名片更新了', user)
      console.log('<-- userinfo update')
      data.users = nim.mergeUsers(data.users, user)
    }

    function onSuperTeams(superTeams) {
      // console.log('收到超大群列表', superTeams)
      console.log('[nim] onSuperTeams', superTeams)

      data.superTeams = nim.mergeTeams(data.superTeams, superTeams)
      onInvalidSuperTeams(superTeams.invalid)
    }
    function onInvalidSuperTeams(teams) {
      data.superTeams = nim.cutTeams(data.superTeams, teams)
      data.invalidSuperTeams = nim.mergeTeams(data.invalidSuperTeams, teams)
      refreshSuperTeamsUI()
    }

    function onDismissSuperTeam(obj) {
      console.log('[nim] - onDismissSuperTeam', obj)
      const { teamId } = obj
      removeAllSuperTeamMembers(teamId)
      data.superTeams = nim.cutTeams(data.superTeams, obj)
      refreshSuperTeamsUI()
      refreshSuperTeamMembersUI()
    }

    function onUpdateSuperTeamMember(member) {
      console.log('[nim] - onUpdateSuperTeamMember', member)
    }

    function refreshSuperTeamsUI() {}
    function refreshSuperTeamMembersUI() {}
    function removeAllSuperTeamMembers(id: string) {
      console.log('removeAllSuperTeamMembers', id)
    }
    function onTeams(teams) {
      // console.log('群列表', teams)
      console.log('[nim] onTeams', teams)
      data.teams = nim.mergeTeams(data.teams, teams)
      onInvalidTeams(teams.invalid)
    }
    function onInvalidTeams(teams) {
      data.teams = nim.cutTeams(data.teams, teams)
      data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams)
      refreshTeamsUI()
    }
    function onCreateTeam(team) {
      console.log('[nim] - onCreateTeam', team)
      // data.teams = nim.mergeTeams(data.teams, team)
      // refreshTeamsUI()
      // onTeamMembers({
      //   teamId: team.teamId,
      //   members: owner,
      // })
    }
    function refreshTeamsUI() {
      // 刷新界面
    }
    function onTeamMembers(obj) {
      console.log('[nim] - onTeamMembers', obj)
      // var teamId = obj.teamId
      // var members = obj.members
      // data.teamMembers = data.teamMembers || {}
      // data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members)
      // data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid)
      // refreshTeamMembersUI()
    }
    // function onSyncTeamMembersDone() {
    //   console.log('[nim] - onSyncTeamMembersDone')
    // }
    function onUpdateTeamMember(teamMember) {
      console.log('[nim] - onUpdateTeamMember', teamMember)
      onTeamMembers({
        teamId: teamMember.teamId,
        members: teamMember,
      })
    }
    // function refreshTeamMembersUI() {
    //   // 刷新界面
    // }

    function onSessions(sessions) {
      // console.log('收到会话列表', sessions)
      data.sessions = nim.mergeSessions(data.sessions, sessions)
      updateSessionsUI()
    }
    function onUpdateSession(session) {
      // console.log('会话更新了', session)
      data.sessions = nim.mergeSessions(data.sessions, session)
      updateSessionsUI()
    }
    function updateSessionsUI() {
      // 刷新界面
    }

    const onRoamingMsgs = (obj) => {
      // console.log('漫游消息', obj)
      console.log('<--', 'roaming msgs', obj.msgs.length)
      // pushMsg(obj.msgs)
      this._emit(EnumRTMClientEvent.RoamingChannelMessage, obj)
    }
    const onOfflineMsgs = (obj) => {
      // console.log('离线消息', obj)
      console.log('<--', 'offline msgs', obj.msgs.length)

      // pushMsg(obj.msgs)
      this._emit(EnumRTMClientEvent.OfflineChannelMessage, obj)
    }
    const onMsg = (msg) => {
      // console.log('收到消息', msg.scene, msg.type, msg)
      pushMsg(msg)
      this._emit(EnumRTMClientEvent.NewChannelMessage, msg)
    }
    function pushMsg(msgs) {
      if (!Array.isArray(msgs)) {
        msgs = [msgs]
      }

      const { sessionId } = msgs[0]
      data.msgs = data.msgs || {}
      data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs)
    }

    function onOfflineSysMsgs(sysMsgs) {
      console.log('[nim] - onOfflineSysMsgs', sysMsgs)
      pushSysMsgs(sysMsgs)
    }
    function onSysMsg(sysMsg) {
      console.log('[nim] - onSysMsg', sysMsg)
      pushSysMsgs(sysMsg)
    }
    function onUpdateSysMsg(sysMsg) {
      pushSysMsgs(sysMsg)
    }
    function pushSysMsgs(sysMsgs) {
      data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs)
      refreshSysMsgsUI()
    }
    function onSysMsgUnread(obj) {
      // console.log('收到系统通知未读数', obj)
      data.sysMsgUnread = obj
      refreshSysMsgsUI()
    }
    function onUpdateSysMsgUnread(obj) {
      // console.log('系统通知未读数更新了', obj)
      data.sysMsgUnread = obj
      refreshSysMsgsUI()
    }
    function refreshSysMsgsUI() {
      // 刷新界面
    }
    function onOfflineCustomSysMsgs(sysMsgs) {
      console.log('[nim] - onOfflineCustomSysMsgs', sysMsgs)
    }
    function onCustomSysMsg(sysMsg) {
      console.log('[nim] - onCustomSysMsg', sysMsg)
    }

    function onSyncDone() {
      console.log('[nim]', 'sync done')
    }

    // import NIM from '@yxim/nim-web-sdk/dist/SDK/NIM_Web_NIM'
    const NIMModule = await import('@yxim/nim-web-sdk/dist/SDK/NIM_Web_NIM')
    // 使用 default 获取 NIM 类
    const NIM = NIMModule.default

    const nim = NIM.getInstance({
      // 初始化SDK
      // debug: true

      /** 海外数据中心配置 */
      lbsUrl: 'https://lbs.netease.im/lbs/webconf',
      defaultLink: 'weblink01-sg.netease.im:443',
      httpsEnabled: true,
      quickReconnect: true,
      // --------------------

      db: false,

      appKey: appKey,
      account,
      token,
      onconnect: onConnect,
      onerror: onError,
      onwillreconnect: onWillReconnect,
      ondisconnect: onDisconnect,
      // * 多端
      // onloginportschange: onLoginPortsChange,
      // 用户关系
      onblacklist: onBlacklist,
      onsyncmarkinblacklist: onMarkInBlacklist,
      onmutelist: onMutelist,
      onsyncmarkinmutelist: onMarkInMutelist,
      // 好友关系
      onfriends: onFriends,
      onsyncfriendaction: onSyncFriendAction,
      // 用户名片
      onmyinfo: onMyInfo,
      // onupdatemyinfo: onUpdateMyInfo,
      onusers: onUsers,
      onupdateuser: onUpdateUser,
      // 超大群
      onSuperTeams: onSuperTeams,
      // onSyncCreateSuperTeam: onSyncCreateSuperTeam,
      onDismissSuperTeam: onDismissSuperTeam,
      onUpdateSuperTeamMember: onUpdateSuperTeamMember,
      // onUpdateSuperTeam: onUpdateSuperTeam, // 更新超大群的回调
      // onAddSuperTeamMembers: onAddSuperTeamMembers, // 新成员入超大群的回调
      // onRemoveSuperTeamMembers: onRemoveSuperTeamMembers,
      // 群组
      onteams: onTeams,
      onsynccreateteam: onCreateTeam,
      // onteammembers: onTeamMembers,
      // onsyncteammembersdone: onSyncTeamMembersDone,
      onupdateteammember: onUpdateTeamMember,
      // 会话
      onsessions: onSessions,
      onupdatesession: onUpdateSession,
      // 消息
      onroamingmsgs: onRoamingMsgs,
      onofflinemsgs: onOfflineMsgs,
      onmsg: onMsg,
      // 系统通知
      onofflinesysmsgs: onOfflineSysMsgs,
      onsysmsg: onSysMsg,
      onupdatesysmsg: onUpdateSysMsg,
      onsysmsgunread: onSysMsgUnread,
      onupdatesysmsgunread: onUpdateSysMsgUnread,
      onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
      oncustomsysmsg: onCustomSysMsg,
      // 同步完成
      onsyncdone: onSyncDone,
    })
    return nim
  }
}
