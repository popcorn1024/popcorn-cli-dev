'use strict';

module.exports = core;

const semver = require('semver')
const colors = require('colors')
// require: .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
const pkg = require('../package.json')
const log = require('@popcorn-cli-dev/log')
const constant = require('./const')

function core() {
	try {
		checkPkgVersion()
		checkNodeVersion()
	} catch (e) {
		log.error(e)
	}
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