DROP PROCEDURE IF EXISTS `addLogV1`;
DELIMITER //
CREATE DEFINER=`tigase_user`@`%` PROCEDURE `addLogV1`(
  IN `pUserId` bigint(20),
  IN `pType` VARCHAR(20),
  IN `pCategory` VARCHAR(100),
  IN `pMessage` VARCHAR(4000),
  IN `pstackTrace` text,
  IN `pPlatform` VARCHAR(20)
)
BEGIN
    insert into logs (userId, type, category, message, stackTrace, platform)
    values (pUserId, pType, pCategory, pMessage, pstackTrace, pPlatform);
END//
DELIMITER ;
