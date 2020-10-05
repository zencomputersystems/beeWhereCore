import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLoginLogDTO {
  @ApiModelProperty({ description: 'User id', example: '561604d0-f98d-11ea-a922-075dec0319ed' })
  @IsNotEmpty()
  @IsString()
  userId: string;// "561604d0-f98d-11ea-a922-075dec0319ed",

  @ApiModelProperty({ description: 'Log timestamp', example: '1601622975' })
  @IsNotEmpty()
  @IsString()
  loggedTimestamp: string;// 1601622975, //in seconds format

  @ApiModelProperty({ description: 'Latitude', example: '2.9261295000000005' })
  @IsNotEmpty()
  @IsString()
  latitude: string;// 2.9261295000000005,

  @ApiModelProperty({ description: 'Longitude', example: '101.6499236' })
  @IsNotEmpty()
  @IsString()
  longitude: string;// 101.6499236,

  @ApiModelProperty({ description: 'Address', example: 'Cyberjaya, Selangor, Malaysia' })
  @IsNotEmpty()
  @IsString()
  address: string;// "Cyberjaya, Selangor, Malaysia",

  @ApiModelProperty({ description: 'Device info', example: 'Safari 13.0.3 on Apple iPhone (iOS 13.2.3)' })
  @IsNotEmpty()
  @IsString()
  deviceInfo: string;// "Safari 13.0.3 on Apple iPhone (iOS 13.2.3)",

  @ApiModelProperty({ description: 'Device public ip', example: '60.53.219.114' })
  @IsNotEmpty()
  @IsString()
  devicePublicIp: string;// "60.53.219.114"
}