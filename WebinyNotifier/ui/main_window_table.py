# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'main_window.ui'
#
# Created: Thu Jan 03 20:16:42 2013
#      by: PyQt4 UI code generator 4.9.5
#
# WARNING! All changes made in this file will be lost!

from PyQt4 import QtCore, QtGui

try:
    _fromUtf8 = QtCore.QString.fromUtf8
except AttributeError:
    _fromUtf8 = lambda s: s

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName(_fromUtf8("MainWindow"))
        MainWindow.resize(986, 762)
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(_fromUtf8(":/webiny/favicon.ico")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        MainWindow.setWindowIcon(icon)
        MainWindow.setUnifiedTitleAndToolBarOnMac(False)
        self.centralwidget = QtGui.QWidget(MainWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.verticalLayout_2 = QtGui.QVBoxLayout(self.centralwidget)
        self.verticalLayout_2.setObjectName(_fromUtf8("verticalLayout_2"))
        self.tableWidget = QtGui.QTableWidget(self.centralwidget)
        self.tableWidget.setObjectName(_fromUtf8("tableWidget"))
        self.tableWidget.setColumnCount(1)
        self.tableWidget.setRowCount(1)
        item = QtGui.QTableWidgetItem()
        self.tableWidget.setVerticalHeaderItem(0, item)
        item = QtGui.QTableWidgetItem()
        self.tableWidget.setHorizontalHeaderItem(0, item)
        self.verticalLayout_2.addWidget(self.tableWidget)
        self.notifications = QtGui.QTableView(self.centralwidget)
        sizePolicy = QtGui.QSizePolicy(QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Expanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.notifications.sizePolicy().hasHeightForWidth())
        self.notifications.setSizePolicy(sizePolicy)
        self.notifications.setSelectionMode(QtGui.QAbstractItemView.SingleSelection)
        self.notifications.setSelectionBehavior(QtGui.QAbstractItemView.SelectRows)
        self.notifications.setShowGrid(True)
        self.notifications.setObjectName(_fromUtf8("notifications"))
        self.notifications.horizontalHeader().setStretchLastSection(True)
        self.verticalLayout_2.addWidget(self.notifications)
        self.verticalLayout = QtGui.QVBoxLayout()
        self.verticalLayout.setObjectName(_fromUtf8("verticalLayout"))
        self.notificationTabs = QtGui.QTabWidget(self.centralwidget)
        self.notificationTabs.setObjectName(_fromUtf8("notificationTabs"))
        self.detailsTab = QtGui.QWidget()
        self.detailsTab.setObjectName(_fromUtf8("detailsTab"))
        self.horizontalLayout_2 = QtGui.QHBoxLayout(self.detailsTab)
        self.horizontalLayout_2.setObjectName(_fromUtf8("horizontalLayout_2"))
        self.notificationDetails = QtGui.QTableView(self.detailsTab)
        self.notificationDetails.setObjectName(_fromUtf8("notificationDetails"))
        self.horizontalLayout_2.addWidget(self.notificationDetails)
        self.notificationTabs.addTab(self.detailsTab, _fromUtf8(""))
        self.backtraceTab = QtGui.QWidget()
        self.backtraceTab.setObjectName(_fromUtf8("backtraceTab"))
        self.horizontalLayout = QtGui.QHBoxLayout(self.backtraceTab)
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.backtraceHtml = QtGui.QTextEdit(self.backtraceTab)
        self.backtraceHtml.setObjectName(_fromUtf8("backtraceHtml"))
        self.horizontalLayout.addWidget(self.backtraceHtml)
        self.notificationTabs.addTab(self.backtraceTab, _fromUtf8(""))
        self.getTab = QtGui.QWidget()
        self.getTab.setObjectName(_fromUtf8("getTab"))
        self.horizontalLayout_3 = QtGui.QHBoxLayout(self.getTab)
        self.horizontalLayout_3.setObjectName(_fromUtf8("horizontalLayout_3"))
        self.notificationTabs.addTab(self.getTab, _fromUtf8(""))
        self.postTab = QtGui.QWidget()
        self.postTab.setObjectName(_fromUtf8("postTab"))
        self.horizontalLayout_4 = QtGui.QHBoxLayout(self.postTab)
        self.horizontalLayout_4.setObjectName(_fromUtf8("horizontalLayout_4"))
        self.notificationTabs.addTab(self.postTab, _fromUtf8(""))
        self.serverTab = QtGui.QWidget()
        self.serverTab.setObjectName(_fromUtf8("serverTab"))
        self.notificationTabs.addTab(self.serverTab, _fromUtf8(""))
        self.verticalLayout.addWidget(self.notificationTabs)
        self.verticalLayout_2.addLayout(self.verticalLayout)
        MainWindow.setCentralWidget(self.centralwidget)
        self.statusbar = QtGui.QStatusBar(MainWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        MainWindow.setStatusBar(self.statusbar)
        self.toolBar = QtGui.QToolBar(MainWindow)
        self.toolBar.setEnabled(True)
        self.toolBar.setMovable(False)
        self.toolBar.setToolButtonStyle(QtCore.Qt.ToolButtonTextUnderIcon)
        self.toolBar.setFloatable(False)
        self.toolBar.setObjectName(_fromUtf8("toolBar"))
        MainWindow.addToolBar(QtCore.Qt.TopToolBarArea, self.toolBar)
        self.actionSettings = QtGui.QAction(MainWindow)
        icon1 = QtGui.QIcon()
        icon1.addPixmap(QtGui.QPixmap(_fromUtf8(":/webiny/Gear_32.png")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.actionSettings.setIcon(icon1)
        self.actionSettings.setObjectName(_fromUtf8("actionSettings"))
        self.actionClose = QtGui.QAction(MainWindow)
        icon2 = QtGui.QIcon()
        icon2.addPixmap(QtGui.QPixmap(_fromUtf8(":/webiny/5461357682045886304.png")), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        self.actionClose.setIcon(icon2)
        self.actionClose.setObjectName(_fromUtf8("actionClose"))
        self.toolBar.addAction(self.actionSettings)
        self.toolBar.addSeparator()
        self.toolBar.addAction(self.actionClose)

        self.retranslateUi(MainWindow)
        self.notificationTabs.setCurrentIndex(0)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QtGui.QApplication.translate("MainWindow", "Webiny Notifier", None, QtGui.QApplication.UnicodeUTF8))
        item = self.tableWidget.verticalHeaderItem(0)
        item.setText(QtGui.QApplication.translate("MainWindow", "Allies", None, QtGui.QApplication.UnicodeUTF8))
        item = self.tableWidget.horizontalHeaderItem(0)
        item.setText(QtGui.QApplication.translate("MainWindow", "Nazi", None, QtGui.QApplication.UnicodeUTF8))
        self.notificationTabs.setTabText(self.notificationTabs.indexOf(self.detailsTab), QtGui.QApplication.translate("MainWindow", "Details", None, QtGui.QApplication.UnicodeUTF8))
        self.backtraceHtml.setHtml(QtGui.QApplication.translate("MainWindow", "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0//EN\" \"http://www.w3.org/TR/REC-html40/strict.dtd\">\n"
"<html><head><meta name=\"qrichtext\" content=\"1\" /><style type=\"text/css\">\n"
"p, li { white-space: pre-wrap; }\n"
"</style></head><body style=\" font-family:\'MS Shell Dlg 2\'; font-size:8.25pt; font-weight:400; font-style:normal;\">\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; font-size:8pt;\"><br /></p></body></html>", None, QtGui.QApplication.UnicodeUTF8))
        self.notificationTabs.setTabText(self.notificationTabs.indexOf(self.backtraceTab), QtGui.QApplication.translate("MainWindow", "Backtrace", None, QtGui.QApplication.UnicodeUTF8))
        self.notificationTabs.setTabText(self.notificationTabs.indexOf(self.getTab), QtGui.QApplication.translate("MainWindow", "GET", None, QtGui.QApplication.UnicodeUTF8))
        self.notificationTabs.setTabText(self.notificationTabs.indexOf(self.postTab), QtGui.QApplication.translate("MainWindow", "POST", None, QtGui.QApplication.UnicodeUTF8))
        self.notificationTabs.setTabText(self.notificationTabs.indexOf(self.serverTab), QtGui.QApplication.translate("MainWindow", "SERVER", None, QtGui.QApplication.UnicodeUTF8))
        self.toolBar.setWindowTitle(QtGui.QApplication.translate("MainWindow", "toolBar", None, QtGui.QApplication.UnicodeUTF8))
        self.actionSettings.setText(QtGui.QApplication.translate("MainWindow", "Settings", None, QtGui.QApplication.UnicodeUTF8))
        self.actionSettings.setToolTip(QtGui.QApplication.translate("MainWindow", "Settings", None, QtGui.QApplication.UnicodeUTF8))
        self.actionClose.setText(QtGui.QApplication.translate("MainWindow", "Close", None, QtGui.QApplication.UnicodeUTF8))
        self.actionClose.setToolTip(QtGui.QApplication.translate("MainWindow", "Close", None, QtGui.QApplication.UnicodeUTF8))

import webiny_rc
