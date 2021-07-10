'use strict';

module.exports = core;

const path = require('path')

const semver = require('semver')
const colors = require('colors')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
const pkg = require('../package.json')
const log = require('@popcorn-cli-dev/log')
const constant = require('./const')

let args, config

function core() {
	try {
		checkPkgVersion()
		checkNodeVersion()
		checkRoot()
		checkUserHome()
		checkInputArgs()
		checkEnv()
		checkGlobalUpdate()
	} catch(e) {
		log.error(e)
	}
}

function checkRoot() {
	const rootCheck = require('root-check')
	rootCheck()
}

function checkNodeVersion() {
	// 获取当前Node版本号
	const currentNodeVersion = process.version
	// 获取最低版本号
	const lowestNodeVersion = constant.LOWEST_NODE_VERSION
	// 比对版本号
	if(!semver.gte(currentNodeVersion, lowestNodeVersion)) {
		throw new Error(colors.red(`popcorn-cli 需要安装 v${lowestNodeVersion} 以上版本的 Node.js`))
	}
}

function checkPkgVersion() {
	log.info('cli', pkg.version)
}

function checkUserHome() {
	if(!userHome || !pathExists(userHome)) {
		throw new Error(colors.red('当前登陆用户主目录不存在'))
	}
}

function checkInputArgs() {
	const minimist = require('minimist')
	args = minimist(process.argv.slice(2))
	checkArgs()
}

function checkArgs() {
	if(args.debug) {
		process.env.LOG_LEVEL = 'verbose'
	} else {
		process.env.LOG_LEVEL = 'info'
	}
	log.level = process.env.LOG_LEVEL
}

function checkEnv() {
	const dotenv = require('dotenv')
	const dotenvPath = path.resolve(userHome, '.env')
	if(pathExists(dotenvPath)) {
		dotenv.config({
			path: dotenvPath
		})
	}
	config = createDefaultConfig()
}

function createDefaultConfig() {
	const cliConfig = {
		home: userHome
	}
	if(process.env.CLI_HOME) {
		cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
	} else {
		cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
	}
	process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkGlobalUpdate() {
	// 1. 获取当前版本号和模块名
	const currentVersion = pkg.version
	const npmName = pkg.name
	// 2. 调用 npm api，获取所有版本
	const { getNpmInfo } = require('@popcorn-cli-dev/get-npm-info')
	getNpmInfo(npmName)
	// 3. 提取所有版本号，比对哪些版本号是大于当前版本号
	// 4. 获取最新的版本号，提示用户更新到该版本
}